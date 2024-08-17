import React, { useState, useRef, useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard.ts";
import httpClient from "../../httpClient.tsx";
import axios, { AxiosError } from "axios";

interface TermFormProps {
  onClose: () => void;
}

interface Course {
  subject: string;
  course_code: string;
  credits: string;
  grade: number | null | undefined;
  graded: string;
  pass: number | null | undefined;
}

type ErrorResponse = {
  message: string;
  data: Record<string, unknown>;
};

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

const gradeValues: { [key: string]: number | null } = {
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
  "Not Completed": null,
};

const notGradedOptions = ["Pass", "Fail", "Withdraw"];
const notGradedValues: { [key: string]: number | null } = {
  Pass: 1,
  Fail: 0,
  Withdraw: -1,
};

const TermForm: React.FC<TermFormProps> = ({ onClose }) => {
  const { user, fetchDashboardData, accessToken, refreshToken } =
    useDashboard();
  const [year, setYear] = useState<number>();
  const [nextYear, setNextYear] = useState<number>();
  const [semester, setSemester] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([
    {
      subject: "",
      course_code: "",
      credits: "",
      grade: undefined,
      graded: "true",
      pass: undefined,
    },
  ]);
  const [error, setError] = useState("");
  const formContainerRef = useRef<HTMLDivElement>(null);
  const semesters = ["Fall", "Winter", "Spring", "Summer"];

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
      return;
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
      updatedCourses[index][field] =
        e.target.value === ""
          ? undefined
          : e.target.value === "Not Completed"
          ? null
          : gradeValues[e.target.value];
    } else if (field === "pass") {
      updatedCourses[index][field] =
        e.target.value === ""
          ? undefined
          : e.target.value === "Not Completed"
          ? null
          : notGradedValues[e.target.value];
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
        grade: undefined,
        graded: "true",
        pass: undefined,
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
      if (!user || !user.id) {
        throw new Error("User information is missing");
      }

      const payload = courses.map((course) => ({
        user_id: user.id,
        subject: course.subject.toUpperCase(),
        course_code: course.course_code.toUpperCase(),
        term,
        credits: course.credits,
        grade:
          course.graded === "true"
            ? course.grade === undefined
              ? null
              : course.grade
            : course.pass === undefined
            ? null
            : course.pass,
        graded: course.graded,
      }));

      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
      };

      if (refreshToken) {
        headers["refresh-token"] = refreshToken;
      }

      const response = await httpClient.post("/courses/many", payload, {
        headers,
      });

      if (response.status === 201) {
        await fetchDashboardData();
        onClose();
      } else if (response.status === 500) {
        setError(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          let errorMessage = "An unknown error occurred";
          try {
            const parsedError = JSON.parse(
              axiosError.response.data.message.replace(/'/g, '"')
            );
            errorMessage = parsedError.message || "An unknown error occurred";
          } catch (parseError) {
            console.error("Error parsing error message:", parseError);
            errorMessage = axiosError.response.data.message;
          }

          setError(
            `Server Error: ${axiosError.response.status} - ${errorMessage}`
          );
          console.error("Full error response:", axiosError.response);
        } else if (axiosError.request) {
          setError("No response received from server");
          console.error("Error request:", axiosError.request);
        } else {
          setError(`Error: ${axiosError.message}`);
          console.error("Error:", axiosError.message);
        }
      } else {
        setError(
          `An unexpected error occurred: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={formContainerRef}
        className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-2xl max-h-[90vh] w-full max-w-3xl overflow-y-auto text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Add Term</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="semester" className="block mb-2 font-semibold">
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={semester}
                onChange={(e) => handleTermChange(e, "semester")}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                required
              >
                <option value="">Select a semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block mb-2 font-semibold">
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
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                  required
                />
                <div className="h-[2px] w-4 bg-white/50"></div>
                <input
                  type="number"
                  id="nextYear"
                  name="nextYear"
                  value={nextYear}
                  disabled
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Courses */}
          {courses.map((course, index) => (
            <div key={index} className="bg-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Course {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveCourse(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Subject"
                  value={course.subject}
                  onChange={(e) => handleCourseChange(e, index, "subject")}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Course Code"
                  value={course.course_code}
                  onChange={(e) => handleCourseChange(e, index, "course_code")}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                  required
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={(e) => handleCourseChange(e, index, "credits")}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                  required
                />
                <div>
                  <select
                    value={course.graded}
                    onChange={(e) => handleCourseChange(e, index, "graded")}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                  >
                    <option value="true">Graded</option>
                    <option value="false">Pass/Fail</option>
                  </select>
                </div>
                {course.graded === "true" ? (
                  <select
                    value={
                      course.grade === undefined
                        ? ""
                        : course.grade === null
                        ? "Not Completed"
                        : Object.keys(gradeValues).find(
                            (key) => gradeValues[key] === course.grade
                          ) || ""
                    }
                    onChange={(e) => handleCourseChange(e, index, "grade")}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                  >
                    <option value="">Select a grade</option>
                    {letterGrades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                    <option value="Not Completed">Not Completed</option>
                  </select>
                ) : (
                  <select
                    value={
                      course.pass === undefined
                        ? ""
                        : course.pass === null
                        ? "Not Completed"
                        : Object.keys(notGradedValues).find(
                            (key) => notGradedValues[key] === course.pass
                          ) || ""
                    }
                    onChange={(e) => handleCourseChange(e, index, "pass")}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                  >
                    <option value="">Select pass/fail</option>
                    {notGradedOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value="Not Completed">Not Completed</option>
                  </select>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="px-4 py-3 bg-red-500/50 border border-red-700 rounded-lg text-white">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddCourse}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            Add Course
          </button>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
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
