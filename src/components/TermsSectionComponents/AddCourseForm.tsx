import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../../hooks/useDashboard.ts";
import httpClient from "../../httpClient.tsx";
import { useNavigate } from "react-router-dom";

interface AddCourseFormProps {
  term: string;
  onClose: () => void;
  isEdit: boolean;
  course: Course | null;
  courseId: string | null;
}

interface Course {
  subject: string;
  course_code: string;
  term: number;
  credits: number;
  grade: number | null;
  graded: boolean;
}

const letterGrades: { [key: number]: string } = {
  4.3: "A+",
  4.0: "A",
  3.7: "A-",
  3.3: "B+",
  3.0: "B",
  2.7: "B-",
  2.3: "C+",
  2.0: "C",
  1.7: "C-",
  1.3: "D+",
  1.0: "D",
  0.0: "F",
  "-1": "WITHDRAW",
};

const gradeValues: { [key: string]: number } = {
  "A+": 4.3,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
  WITHDRAW: -1,
};

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  term,
  onClose,
  isEdit,
  course,
  courseId,
}) => {
  const { fetchDashboardData, accessToken, refreshToken, clearTokens, user } =
    useDashboard();
  const [subject, setSubject] = useState(course?.subject || "");
  const [courseCode, setCourseCode] = useState(course?.course_code || "");
  const [credits, setCredits] = useState(course?.credits.toString() || "");
  const [grade, setGrade] = useState<string>("");
  const [graded, setGraded] = useState(course?.graded ?? true);
  const [pass, setPass] = useState<string>("not_complete");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (course) {
      setSubject(course.subject);
      setCourseCode(course.course_code);
      setCredits(course.credits.toString());
      setGraded(course.graded);

      if (course.graded) {
        setGrade(
          course.grade !== null
            ? letterGrades[course.grade] || "NOT_COMPLETE"
            : "NOT_COMPLETE"
        );
      } else {
        setGrade("");
        setPass(
          course.grade === 1
            ? "pass"
            : course.grade === 0
            ? "fail"
            : course.grade === -1
            ? "withdraw"
            : "not_complete"
        );
      }
    }
  }, [course]);

  const handleDelete = useCallback(async () => {
    if (!courseId) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${subject}-${courseCode} from this term?`
    );
    if (confirmDelete) {
      try {
        if (!accessToken || !refreshToken) {
          throw new Error("Missing authentication tokens");
        }

        const response = await httpClient.delete(`/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "refresh-token": refreshToken,
          },
        });

        if (response.status === 200) {
          await fetchDashboardData();
          onClose();
        } else {
          setError("Failed to delete course. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        setError("An error occurred while deleting the course.");
        if (error.response && error.response.status === 401) {
          clearTokens();
          navigate("/");
        }
      }
    }
  }, [
    courseId,
    subject,
    courseCode,
    accessToken,
    refreshToken,
    fetchDashboardData,
    onClose,
    clearTokens,
    navigate,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!accessToken || !refreshToken) {
          throw new Error("Missing authentication tokens");
        }

        if (!user || !user.id) {
          throw new Error("User information is missing");
        }

        const termNumber = parseInt(term, 10);
        let numericGrade: number | null = null;

        if (graded) {
          numericGrade = grade === "NOT_COMPLETE" ? null : gradeValues[grade];
        } else {
          numericGrade =
            pass === "pass"
              ? 1
              : pass === "fail"
              ? 0
              : pass === "withdraw"
              ? -1
              : null;
        }

        const courseData = {
          user_id: user.id,
          subject,
          course_code: courseCode,
          term: termNumber,
          credits: parseInt(credits, 10),
          grade: numericGrade,
          graded,
        };

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": refreshToken,
        };

        let response;
        if (isEdit && courseId) {
          response = await httpClient.put(`/courses/${courseId}`, courseData, {
            headers,
          });
        } else {
          response = await httpClient.post("/courses/", courseData, {
            headers,
          });
        }

        if (response.status === 200 || response.status === 201) {
          await fetchDashboardData();
          onClose();
        } else {
          throw new Error("Unexpected response status: " + response.status);
        }
      } catch (error) {
        console.error("Error submitting course:", error);
        if (error.response) {
          if (error.response.status === 401) {
            setError("Your session has expired. Please log in again.");
            clearTokens();
            navigate("/");
          } else if (error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError(
              "An error occurred while submitting the course. Please try again."
            );
          }
        } else if (error.request) {
          setError(
            "No response received from the server. Please check your internet connection and try again."
          );
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      }
    },
    [
      subject,
      courseCode,
      credits,
      grade,
      graded,
      pass,
      term,
      isEdit,
      courseId,
      accessToken,
      refreshToken,
      fetchDashboardData,
      onClose,
      clearTokens,
      user,
      navigate,
    ]
  );

  return (
    <div className="py-3 border-t px-5 mt-4">
      <div className="mb-3 text-[20px] text-white">
        {isEdit ? "Edit Course" : "Add A Course"}
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-y-4 gap-x-[8%] text-black"
      >
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value.toUpperCase())}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          value={courseCode}
          placeholder="Course Code"
          onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={credits}
          placeholder="Credits"
          onChange={(e) => setCredits(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        {graded ? (
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select GRADE</option>
            {Object.entries(gradeValues)
              .sort(([, a], [, b]) => b - a)
              .map(([letterGrade, numericGrade]) => (
                <option key={numericGrade} value={letterGrade}>
                  {letterGrade}
                </option>
              ))}
            <option value="NOT_COMPLETE">NOT COMPLETED</option>
          </select>
        ) : (
          <select
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select PASS/FAIL</option>
            <option value="pass">PASS</option>
            <option value="fail">FAIL</option>
            <option value="withdraw">WITHDRAW</option>
            <option value="not_complete">NOT COMPLETED</option>
          </select>
        )}
        <div className="flex items-center space-x-4 bg-gray-100 py-2 px-3 rounded">
          <label>Graded:</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="graded-yes"
              checked={graded}
              onChange={() => setGraded(true)}
              className="mr-2"
            />
            <label htmlFor="graded-yes" className="text-gray-800">
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="graded-no"
              checked={!graded}
              onChange={() => setGraded(false)}
              className="mr-2"
            />
            <label htmlFor="graded-no" className="text-gray-800">
              No
            </label>
          </div>
        </div>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-red-500 rounded focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 hover:bg-red-600"
          >
            Delete Course
          </button>
        )}
        {error && (
          <div className="col-span-2 px-4 py-2 text-red-500 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        <div className="col-span-2 flex justify-end mt-4 mb-2">
          <button
            type="submit"
            className="px-4 py-2 mr-2 text-white bg-orange-500 rounded focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 hover:bg-orange-800"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded bg-white focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
