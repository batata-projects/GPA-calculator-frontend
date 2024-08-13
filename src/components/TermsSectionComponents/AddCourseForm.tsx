import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import httpClient from "../../httpClient.tsx";

interface AddCourseFormProps {
  user_id: string | null;
  accessToken: string | null;
  refreshToken: string | number | boolean;
  term: string | null;
  onClose: () => void;
  isEdit: boolean | null;
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
  user_id,
  accessToken,
  refreshToken,
  term,
  onClose,
  isEdit,
  course,
  courseId,
}) => {
  const [subject, setSubject] = useState(course?.subject || "");
  const [courseCode, setCourseCode] = useState(course?.course_code || "");
  const [credits, setCredits] = useState(course?.credits.toString() || "");
  const [grade, setGrade] = useState(
    course
      ? course.graded
        ? course.grade !== null
          ? letterGrades[course.grade] || "NOT_COMPLETE"
          : "NOT_COMPLETE"
        : ""
      : ""
  );
  const [graded, setGraded] = useState(course?.graded.toString() || "true");
  const [status, setStatus] = useState(
    course?.graded
      ? ""
      : course?.grade === 1
      ? "pass"
      : course?.grade === 0
      ? "fail"
      : course?.grade === -1
      ? "withdraw"
      : "not_complete"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setSubject(course?.subject || "");
    setCourseCode(course?.course_code || "");
    setCredits(course?.credits.toString() || "");
    setGraded(course?.graded.toString() || "true");

    if (course) {
      if (course.graded) {
        setGrade(
          course.grade !== null
            ? letterGrades[course.grade] || "NOT_COMPLETE"
            : "NOT_COMPLETE"
        );
        setStatus("");
      } else {
        setGrade("");
        setStatus(
          course.grade === 1
            ? "pass"
            : course.grade === 0
            ? "fail"
            : course.grade === -1
            ? "withdraw"
            : "not_complete"
        );
      }
    } else {
      setGrade("");
      setStatus("");
    }
  }, [course]);

  const handleError = (error: unknown) => {
    console.error("Error:", error);

    let errorMessage = "An unexpected error occurred. Please try again.";

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response) {
        // Server responded with a status code outside of 2xx range
        errorMessage =
          axiosError.response.data?.detail ||
          axiosError.response.data?.message ||
          axiosError.response.data ||
          "An error occurred while processing your request.";
      } else if (axiosError.request) {
        // Request was made but no response was received
        errorMessage =
          "No response received from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage =
          axiosError.message || "An error occurred while sending the request.";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    setError(errorMessage);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${course?.subject}-${courseCode} from this term?`
    );
    if (confirmDelete) {
      try {
        if (courseId) {
          const response = await httpClient.delete(`/courses/${courseId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "refresh-token": refreshToken,
            },
          });

          if (response.status === 200) {
            onClose();
            window.location.reload();
          } else {
            setError(
              response.data.message ||
                "An error occurred while deleting the course."
            );
          }
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any existing errors
    try {
      const termNumber = term !== null ? parseInt(term, 10) : null;
      let numericGrade: number | null = null;

      if (graded === "true") {
        numericGrade = grade === "NOT_COMPLETE" ? null : gradeValues[grade];
      } else {
        numericGrade =
          status === "pass"
            ? 1
            : status === "fail"
            ? 0
            : status === "withdraw"
            ? -1
            : null;
      }

      const courseData = {
        user_id,
        subject,
        course_code: courseCode,
        term: termNumber,
        credits: parseFloat(credits),
        grade: numericGrade,
        graded: graded === "true",
      };

      let response;
      if (isEdit && courseId) {
        response = await httpClient.put(`/courses/${courseId}`, courseData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "refresh-token": refreshToken,
          },
        });
      } else {
        response = await httpClient.post("/courses/", courseData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "refresh-token": refreshToken,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        onClose();
        window.location.reload();
      } else {
        // This block will likely not be reached due to Axios throwing an error for non-2xx responses
        setError(response.data?.message || "An unexpected error occurred.");
      }
    } catch (error) {
      handleError(error);
    }
  };

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
                value="true"
                checked={graded === "true"}
                onChange={() => setGraded("true")}
              />
              <span className="ml-2">Graded</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="gradingType"
                value="false"
                checked={graded === "false"}
                onChange={() => setGraded("false")}
              />
              <span className="ml-2">Pass/Fail</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium mb-1">
            {graded === "true" ? "Grade" : "Status"}
          </label>
          <select
            id="grade"
            value={graded === "true" ? grade : status}
            onChange={(e) =>
              graded === "true"
                ? setGrade(e.target.value)
                : setStatus(e.target.value)
            }
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
          >
            <option value="">
              Select {graded === "true" ? "Grade" : "Status"}
            </option>
            {graded === "true" ? (
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
