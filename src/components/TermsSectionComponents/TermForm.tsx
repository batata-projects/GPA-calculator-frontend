import React, { useState, useRef, useEffect } from "react";
import httpClient from "../../httpClient.tsx";

interface Course {
  subject: string;
  course_code: string;
  credits: string;
  grade: number | null;
  graded: string;
  pass: number | null;
}

interface TermFormProps {
  onClose: () => void;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | number | boolean;
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
  "Withdraw",
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
  Withdraw: -1,
};

const notGradedOptions = ["Pass", "Fail", "Withdraw"];
const notGradedValues: { [key: string]: number } = {
  Pass: 1,
  Fail: 0,
  Withdraw: -1,
};

const TermForm: React.FC<TermFormProps> = ({
  onClose,
  userId,
  accessToken,
  refreshToken,
}) => {
  const [year, setYear] = useState<number>();
  const [nextYear, setNextYear] = useState<number>();
  const [semester, setSemester] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([
    {
      subject: "",
      course_code: "",
      credits: "",
      grade: null,
      graded: "true",
      pass: null,
    },
  ]);
  const [error, setError] = useState("");
  const formContainerRef = useRef<HTMLDivElement>(null);
  const semesters = ["Fall", "Winter", "Spring", "Summer"];

  // UseEffects
  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollTo({
        top: formContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [courses]);

  useEffect(() => {
    if (year) {
      setNextYear(year + 1);
    } else {
      setNextYear(undefined);
    }
  }, [year]);

  // Handles
  const handleTermChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>,
    field: "year" | "semester"
  ) => {
    if (field === "year") {
      setYear(parseInt(e.target.value));
    } else {
      setSemester(e.target.value);
    }
  };

  const handleRemoveCourse = (index: number) => {
    if (courses.length === 1) {
      setError(
        "Course cannot be removed. A term needs to have at least 1 course."
      );
      return; // Prevent removal if there is only one course
    }
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    setCourses(updatedCourses);
  };

  const handleCourseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: keyof Course
  ) => {
    const updatedCourses = [...courses];
    if (field === "grade") {
      updatedCourses[index][field] = gradeValues[e.target.value];
    } else if (field === "pass") {
      updatedCourses[index][field] = notGradedValues[e.target.value];
    } else {
      updatedCourses[index][field] = e.target.value;
    }
    setCourses(updatedCourses);
  };

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      {
        subject: "",
        course_code: "",
        credits: "",
        grade: null,
        graded: "true",
        pass: null,
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const semesterCode = {
      Fall: "10",
      Winter: "15",
      Spring: "20",
      Summer: "30",
    }[semester];
    const term = parseInt(`${year}${semesterCode}`);

    try {
      const payload = courses.map((course) => ({
        user_id: userId,
        subject: course.subject.toUpperCase(),
        course_code: course.course_code.toUpperCase(),
        term,
        credits: course.credits,
        grade: course.graded === "true" ? course.grade : course.pass,
        graded: course.graded,
      }));
      const response = await httpClient.post("/courses/many", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": refreshToken,
        },
      });
      console.log(response);

      if (response.status === 201) {
        window.location.reload();
        onClose();
      } else if (response.status === 500) {
        setError(response.data.message);
      }
    } catch (error) {
      setError(`${error.response.data.detail}, Please sign in again.`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={formContainerRef}
        className="bg-white p-8 rounded shadow-lg max-h-[80vh] min-w-[50%] max-w-[50%] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6">Add Term</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-4">
              <label htmlFor="semester" className="block mb-1">
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={semester}
                onChange={(e) => handleTermChange(e, "semester")}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a semester</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="year" className="block mb-1">
                Academic Year
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={year}
                  placeholder="yyyy"
                  onChange={(e) => handleTermChange(e, "year")}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
                <div className="h-[2px] w-4 bg-gray-400"></div>
                <input
                  type="number"
                  id="nextYear"
                  name="nextYear"
                  value={nextYear}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
            </div>
          </div>

          {courses.map((course, index) => (
            <div key={index} className="mb-6 pt-6 border-t">
              <div className=" flex flex-row">
                <h3 className="text-lg font-bold mb-2">Course {index + 1}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="mb-2">
                  <input
                    type="text"
                    id={`subject-${index}`}
                    name={`subject-${index}`}
                    value={course.subject}
                    placeholder="Subject"
                    onChange={(e) => handleCourseChange(e, index, "subject")}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    id={`course_code-${index}`}
                    name={`course_code-${index}`}
                    value={course.course_code}
                    placeholder="Course Code"
                    onChange={(e) =>
                      handleCourseChange(e, index, "course_code")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="number"
                    id={`credits-${index}`}
                    name={`credits-${index}`}
                    value={course.credits}
                    placeholder="Credits"
                    onChange={(e) => handleCourseChange(e, index, "credits")}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="mb-2">
                  {course.graded === "true" ? (
                    <select
                      id={`grade-${index}`}
                      name={`grade-${index}`}
                      value={
                        course.grade !== null
                          ? letterGrades.find(
                              (grade) => gradeValues[grade] === course.grade
                            )
                          : ""
                      }
                      onChange={(e) => handleCourseChange(e, index, "grade")}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
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
                      id={`grade-${index}`}
                      name={`grade-${index}`}
                      value={
                        course.pass !== null
                          ? notGradedOptions.find(
                              (grade) => notGradedValues[grade] === course.pass
                            )
                          : ""
                      }
                      onChange={(e) => handleCourseChange(e, index, "pass")}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Select pass/fail</option>
                      {Object.entries(notGradedValues)
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
                  )}
                </div>

                <div className="mb-2">
                  <label className="block mb-1">Graded</label>
                  <div className="flex items-center">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="radio"
                        name={`graded-${index}`}
                        value="true"
                        checked={course.graded === "true"}
                        onChange={(e) => handleCourseChange(e, index, "graded")}
                        className="mr-2"
                        required
                      />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`graded-${index}`}
                        value="false"
                        checked={course.graded === "false"}
                        onChange={(e) => handleCourseChange(e, index, "graded")}
                        className="mr-2"
                        required
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCourse(index)}
                className="px-2 py-1 text-white bg-red-500 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          {error && (
            <div className="px-4 py-2 mb-4 text-red-500 bg-red-100 border w-[60%] border-red-400 rounded overflow-y-auto  ">
              {error}
            </div>
          )}
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
