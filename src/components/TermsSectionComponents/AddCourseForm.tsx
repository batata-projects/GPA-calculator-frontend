import React, { useState } from "react";
import httpClient from "../../httpClient.tsx";

interface AddCourseFormProps {
  user_id: string | null;
  accessToken: string | null;
  refreshToken: string | number | boolean;
  term: string | null;
  onClose: () => void;
}

const letterGrades = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "F",
];

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
};

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  user_id,
  accessToken,
  refreshToken,
  term,
  onClose,
}) => {
  const [subject, setSubject] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credits, setCredits] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [graded, setGraded] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const termNumber = term !== null ? parseInt(term, 10) : null;
      const numericGrade = gradeValues[grade];
      console.log(
        user_id,
        subject,
        courseCode,
        term,
        credits,
        numericGrade,
        graded
      );
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
      if (response.data.status === 201) {
        // Course added successfully
        window.location.reload();
        onClose();
      } else if (response.data.status === 500) {
        setError(response.data.message);
      }
    } catch (error) {
      setError(`${error.response.data.detail}, Please sign in again.`);
    }
  };

  return (
    <div className="py-3 border-t px-3 mt-4">
      <div className="mb-3 text-[20px]">Add A Course</div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-y-4 gap-x-[8%] text-black"
      >
        <div className="col-span-1">
          <input
            id="subject"
            type="text"
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-1">
          <input
            id="course code"
            type="text"
            placeholder="Course Code"
            onChange={(e) => setCourseCode(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-1">
          <input
            id="credits"
            type="text"
            placeholder="Credits"
            onChange={(e) => setCredits(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-1 space-y-2">
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select a grade</option>
            {letterGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          <div className=" flex items-center space-x-4 bg-gray-100 py-2 px-3 rounded">
            <label className="text-gray-800">Graded:</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="graded-yes"
                value="true"
                checked={graded === "true"}
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
        </div>

        {error && (
          <div className="col-span-2 px-4 py-2 text-red-500 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        <div className="col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 mr-2 text-white bg-blue-500 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
