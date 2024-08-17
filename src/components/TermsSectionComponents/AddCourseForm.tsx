import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../../hooks/useDashboard.ts";
import httpClient from "../../httpClient.tsx";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

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

  const handleError = (error: unknown) => {
    console.error("Error:", error);

    let errorMessage = "An unexpected error occurred. Please try again.";

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response) {
        errorMessage =
          axiosError.response.data?.detail ||
          axiosError.response.data?.message ||
          axiosError.response.data ||
          "An error occurred while processing your request.";
      } else if (axiosError.request) {
        errorMessage =
          "No response received from server. Please check your connection.";
      } else {
        errorMessage =
          axiosError.message || "An error occurred while sending the request.";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    setError(errorMessage);
  };

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
        handleError(error);
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
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(""); // Clear any existing errors
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
        handleError(error);
        if (error.response && error.response.status === 401) {
          clearTokens();
          navigate("/");
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
    <div className="bg-white/10 rounded-lg p-4 mt-4 text-white">
      <h3 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Course" : "Add Course"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Subject & Code
          </label>
          <div className="flex space-x-2">
            <input
              id="subject"
              type="text"
              placeholder="e.g MATH"
              value={subject}
              onChange={(e) => setSubject(e.target.value.toUpperCase())}
              required
              className="w-1/2 px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50"
            />
            <input
              id="courseCode"
              type="text"
              placeholder="e.g 101"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              required
              className="w-1/2 px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="credits" className="block text-sm font-medium mb-1">
            Credits
          </label>
          <input
            id="credits"
            type="number"
            min="0"
            step="0.5"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            required
            placeholder="e.g 3"
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Grading Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="gradingType"
                checked={graded}
                onChange={() => setGraded(true)}
              />
              <span className="ml-2">Graded</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="gradingType"
                checked={!graded}
                onChange={() => setGraded(false)}
              />
              <span className="ml-2">Pass/Fail</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium mb-1">
            {graded ? "Grade" : "Status"}
          </label>
          <select
            id="grade"
            value={graded ? grade : pass}
            onChange={(e) =>
              graded ? setGrade(e.target.value) : setPass(e.target.value)
            }
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
          >
            <option value="">Select {graded ? "Grade" : "Status"}</option>
            {graded ? (
              Object.entries(gradeValues)
                .sort(([, a], [, b]) => b - a)
                .map(([letterGrade]) => (
                  <option key={letterGrade} value={letterGrade}>
                    {letterGrade}
                  </option>
                ))
            ) : (
              <>
                <option value="pass">PASS</option>
                <option value="fail">FAIL</option>
                <option value="withdraw">WITHDRAW</option>
              </>
            )}
            <option value="NOT_COMPLETE">NOT COMPLETED</option>
          </select>
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-500/50 border border-red-700 rounded text-white text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
