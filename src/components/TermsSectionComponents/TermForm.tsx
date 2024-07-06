import React, { useState, useRef, useEffect } from "react";
import httpClient from "../../httpClient.tsx";

interface Course {
  subject: string;
  course_code: string;
  credits: string;
  grade: string;
  graded: string;
}

interface TermFormProps {
  onClose: () => void;
  userId: string | null;
}

const TermForm: React.FC<TermFormProps> = ({ onClose, userId }) => {
  const [term, setTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleCourseChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    index: number,
    field: keyof Course
  ) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = e.target.value;
    setCourses(updatedCourses);
  };

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      {
        subject: "",
        course_code: "",
        credits: "",
        grade: "",
        graded: "",
      },
    ]);
  };

  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollTo({
        top: formContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [courses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = courses.map((course) => ({
        user_id: userId,
        subject: course.subject,
        course_code: course.course_code,
        term,
        credits: course.credits,
        grade: course.grade,
        graded: course.graded,
      }));
      await httpClient.post("/api/terms", payload);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={formContainerRef}
        className="bg-white p-8 rounded shadow-lg max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Add Term</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="term" className="block mb-1">
              Term Name
            </label>
            <input
              type="text"
              id="term"
              name="term"
              value={term}
              onChange={handleTermChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          {courses.map((course, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-bold mb-2">Course {index + 1}</h3>
              <div className="mb-2">
                <label htmlFor={`subject-${index}`} className="block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id={`subject-${index}`}
                  name={`subject-${index}`}
                  value={course.subject}
                  onChange={(e) => handleCourseChange(e, index, "subject")}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`course_code-${index}`} className="block mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  id={`course_code-${index}`}
                  name={`course_code-${index}`}
                  value={course.course_code}
                  onChange={(e) => handleCourseChange(e, index, "course_code")}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`credits-${index}`} className="block mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  id={`credits-${index}`}
                  name={`credits-${index}`}
                  value={course.credits}
                  onChange={(e) => handleCourseChange(e, index, "credits")}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`grade-${index}`} className="block mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  id={`grade-${index}`}
                  name={`grade-${index}`}
                  value={course.grade}
                  onChange={(e) => handleCourseChange(e, index, "grade")}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`graded-${index}`} className="block mb-1">
                  Graded
                </label>
                <select
                  id={`graded-${index}`}
                  name={`graded-${index}`}
                  value={course.graded}
                  onChange={(e) => handleCourseChange(e, index, "graded")}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCourse}
            className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
          >
            Add Course
          </button>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TermForm;
