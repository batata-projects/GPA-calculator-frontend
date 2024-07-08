import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../../httpClient.tsx";

interface AddCourseFormProps {
  user_id: string | null;
  accessToken: string | null;
  refreshToken: string | number | boolean;
  term: string | null;
  onClose: () => void;
}

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
  const [grade, setGrade] = useState<number>(0);
  const [graded, setGraded] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const termNumber = term !== null ? parseInt(term, 10) : null;
      console.log(user_id, subject, courseCode, term, credits, grade, graded);
      const response = await httpClient.post(
        "/courses/",
        {
          user_id,
          subject,
          course_code: courseCode,
          term: termNumber,
          credits,
          grade,
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
    <div className="flex flex-col border-t p-4 mt-4">
      <div className="text-xl mb-3">Add Course</div>
      <form onSubmit={handleSubmit} className=" space-y-2 text-black">
        <div>
          <input
            type="text"
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
            required
            className=" rounded-xl p-2"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Course Code"
            onChange={(e) => setCourseCode(e.target.value)}
            required
            className=" rounded-xl p-2"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Credits"
            onChange={(e) => setCredits(e.target.value)}
            required
            className=" rounded-xl p-2"
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Grade"
            onChange={(e) => setGrade(parseFloat(e.target.value))}
            required
            className=" rounded-xl p-2"
          />
        </div>
        <div className="flex flex-row space-x-2 text-white">
          <div>Graded:</div>
          <div className="flex items-center">
            <input
              type="radio"
              id="graded-yes"
              value="True"
              checked={graded === "True"}
              onChange={() => setGraded("True")}
              className="mr-2"
            />
            <label htmlFor="graded-yes">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="graded-no"
              value="False"
              checked={graded === "False"}
              onChange={() => setGraded("False")}
              className="mr-2"
            />
            <label htmlFor="graded-no">No</label>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-md bg-white rounded-xl p-2 w-[25%] flex">
            {error}
          </p>
        )}

        <div className="flex justify-start">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 text-white py-2 px-4 rounded-md mr-2"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
