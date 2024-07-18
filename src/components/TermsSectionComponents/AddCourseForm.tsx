import React, { useState, useEffect } from "react";
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
  grade: number;
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
    course ? (course.graded ? letterGrades[course.grade] : "") : ""
  );
  const [graded, setGraded] = useState(course?.graded.toString() || "true");
  const [pass, setPass] = useState(
    course?.grade === 1 ? "pass" : course?.grade === 0 ? "fail" : "withdraw"
  );
  const [error, setError] = useState("");

  // Use Effects
  useEffect(() => {
    setSubject(course?.subject || "");
    setCourseCode(course?.course_code || "");
    setCredits(course?.credits.toString() || "");
    setGraded(course?.graded.toString() || "true");

    if (course) {
      if (course.graded) {
        setGrade(letterGrades[course.grade]);
        setPass("");
      } else {
        setGrade("");
        setPass(
          course.grade === 1 ? "pass" : course.grade === 0 ? "fail" : "withdraw"
        );
      }
    } else {
      setGrade("");
      setPass("");
    }
  }, [course]);

  // Handles
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${course?.subject}-${courseCode} from this term?`
    );
    if (confirmDelete) {
      try {
        if (courseId) {
          // Delete the course
          const response = await httpClient.delete(`/courses/${courseId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "refresh-token": refreshToken,
            },
          });

          console.log(response);
          if (response.data.status === 200) {
            onClose();
            window.location.reload();
          } else if (response.data.status === 500) {
            setError(response.data.message);
          }
        }
      } catch (error) {
        setError(`${error.response.data.detail}, Please sign in again.`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const termNumber = term !== null ? parseInt(term, 10) : null;
      const numericGrade =
        graded === "true"
          ? gradeValues[grade]
          : pass === "pass"
          ? 1
          : pass === "fail"
          ? 0
          : -1; // Assign -1 for "withdraw"

      if (courseId) {
        // Edit the existing course
        const response = await httpClient.put(
          `/courses/${courseId}`,
          {
            user_id,
            subject,
            course_code: courseCode,
            term: termNumber,
            credits,
            grade: numericGrade,
            graded,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "refresh-token": refreshToken,
            },
          }
        );
        console.log(response);

        if (response.status === 200) {
          onClose();
          window.location.reload();
        } else if (response.status === 500) {
          setError(response.data.message);
        }
      } else {
        // Add a new course
        const response = await httpClient.post(
          "/courses/",
          {
            user_id,
            subject,
            course_code: courseCode,
            term: termNumber,
            credits,
            grade: numericGrade,
            graded,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "refresh-token": refreshToken,
            },
          }
        );
        console.log(response);

        if (response.status === 201) {
          onClose();
          window.location.reload();
        } else if (response.status === 500) {
          setError(response.data.message);
        }
      }
    } catch (error) {
      setError(`${error.response.data.detail}, Please sign in again.`);
    }
  };

  return (
    <div className="py-3 border-t px-5 mt-4">
      <div className="mb-3 text-[20px]">
        {isEdit ? "Edit Course" : "Add A Course"}
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-y-4 gap-x-[8%] text-black"
      >
        <div className="col-span-1">
          <input
            id="subject"
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value.toUpperCase())}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-1">
          <input
            id="course code"
            type="text"
            value={courseCode}
            placeholder="Course Code"
            onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-1">
          <input
            id="credits"
            type="text"
            value={credits}
            placeholder="Credits"
            onChange={(e) => setCredits(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {graded === "true" ? (
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select a grade</option>
            {Object.entries(gradeValues)
              .sort(
                ([, numericGradeA], [, numericGradeB]) =>
                  numericGradeB - numericGradeA
              )
              .map(([letterGrade, numericGrade]) => (
                <option key={numericGrade} value={letterGrade}>
                  {letterGrade}
                </option>
              ))}
          </select>
        ) : (
          <select
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select pass/fail/withdraw</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
            <option value="withdraw">Withdraw</option>
          </select>
        )}
        <div className="flex items-center space-x-4 bg-gray-100 py-2 px-3 rounded">
          <label htmlFor="grade">Graded:</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="graded-yes"
              value="true"
              checked={graded === "true" || (!course && graded !== "false")}
              onChange={() => setGraded("true")}
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
              value="false"
              checked={graded === "false"}
              onChange={() => setGraded("false")}
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
