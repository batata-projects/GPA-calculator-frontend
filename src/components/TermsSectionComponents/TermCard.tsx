import React, { useState, useRef, useCallback } from "react";
import { useDashboard } from "../../hooks/useDashboard.ts";
import AddCourseForm from "./AddCourseForm.tsx";
import httpClient from "../../httpClient.tsx";

interface Course {
  id: string;
  subject: string;
  course_code: string;
  term: number;
  credits: number;
  grade: number | null;
  graded: boolean;
}

interface TermCardProps {
  term: string;
  termData: {
    name: string;
    gpa: number;
    credits: number;
    courses: {
      [key: string]: Course;
    };
  };
}

const gradeMapping: { [key: number]: string } = {
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
  "-1": "W",
};

const getGradeDisplay = (grade: number | null, graded: boolean): string => {
  if (grade === null) return "NC";
  if (graded) return gradeMapping[grade] || "NC";
  if (grade === 1) return "P";
  if (grade === 0) return "F";
  if (grade === -1) return "W";
  return "NC";
};

const TermCard: React.FC<TermCardProps> = ({ termData, term }) => {
  const { fetchDashboardData, accessToken, refreshToken } = useDashboard();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleDeleteTerm = useCallback(async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this term and all its associated courses?"
    );

    if (confirmDelete) {
      try {
        await Promise.all(
          Object.entries(termData.courses).map(([courseId, course]) =>
            httpClient.delete(`courses/${courseId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                ...(refreshToken && { "refresh-token": refreshToken }),
              },
            })
          )
        );
        await fetchDashboardData();
      } catch (error) {
        setError("Failed to delete term. Please try again.");
        console.error("Error deleting term:", error);
      }
    }
  }, [termData.courses, fetchDashboardData, accessToken, refreshToken]);

  const handleAddCourse = useCallback((courseId?: string, course?: Course) => {
    setIsEdit(!!course);
    setShowForm(true);
    setSelectedCourse(course || null);
    setSelectedCourseId(courseId || null);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedCourse(null);
    setSelectedCourseId(null);
  }, []);

  const sortCourses = useCallback((courses: { [key: string]: Course }) => {
    return Object.entries(courses).sort(([, a], [, b]) => {
      if (a.grade === null && b.grade === null) return 0;
      if (a.grade === null) return 1;
      if (b.grade === null) return -1;
      return b.grade - a.grade;
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="flex flex-col bg-[#055AC5] my-10 rounded-[40px] text-white w-full min-w-[300px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] max-w-[1000px] mx-auto px-4 sm:px-6 sm:pr-0 lg:px-0 element transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:border-2 hover:border-gray-700 mb-3"
    >
      <div className="flex flex-col md:flex-row flex-grow min-h-[300px]">
        <div className="w-full md:w-[80%] flex flex-col py-3 pl-5">
          <div className="text-[29px] flex justify-start mb-6 text-center sm:text-center">
            <div className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-110">
              {termData.name}
            </div>
          </div>
          <div className="flex flex-col items-center md:flex-row md:flex-wrap gap-4 md:gap-6">
            {sortCourses(termData.courses).map(([courseId, course]) => (
              <div
                key={courseId}
                className="flex flex-row items-center md:items-center space-x-2 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110"
              >
                <button
                  onClick={() => handleAddCourse(courseId, course)}
                  className="bg-white text-black rounded-[40px] py-1 px-5 flex justify-center items-center text-[17px] min-w-[150px] h-[45px]"
                >
                  {course.subject} {course.course_code}
                </button>
                <button
                  onClick={() => handleAddCourse(courseId, course)}
                  className={`bg-white text-black rounded-full w-[60px] px-2 h-[45px] flex justify-center items-center text-[17px] ${
                    course.grade === null ? "not-completed" : ""
                  }`}
                  title={
                    course.grade === null
                      ? "Not Completed"
                      : course.graded
                      ? course.grade === -1
                        ? "Withdrawn"
                        : gradeMapping[course.grade]
                      : course.grade === 1
                      ? "Pass"
                      : course.grade === -1
                      ? "Withdrawn"
                      : "Fail"
                  }
                >
                  {getGradeDisplay(course.grade, course.graded)}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-auto mr-2 md:self-end self-center">
            <button
              onClick={() => handleAddCourse()}
              className="bg-orange-500 hover:bg-white hover:text-black text-white py-2 px-5 rounded-[40px] text-[14px] transition duration-300 ease-in-out transform hover:scale-110 mt-5"
            >
              Add Another Course
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/4 flex flex-col p-4 md:p-8 relative items-center border-t md:border-t-0 md:border-l">
          <button
            onClick={handleDeleteTerm}
            className="absolute top-4 right-4 transition duration-300 ease-in-out transform hover:scale-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
          <div className="mt-12 text-[36px] md:text-[48px] lg:mt-6 font-bold focus:outline-none transition duration-300 ease-in-out transform hover:scale-110">
            GPA
          </div>
          <div className="flex justify-center items-center bg-orange-500 rounded-[40px] h-[60px] sm:h-[70px] md:h-[80px] w-[120px] sm:w-[130px] md:w-[140px] text-[24px] sm:text-[28px] md:text-[32px] px-4 overflow-hidden transition duration-300 ease-in-out transform hover:scale-110 mt-4">
            {(Math.floor(termData.gpa * 100) / 100).toFixed(2)}
          </div>
        </div>
      </div>
      {error && (
        <div className="col-span-2 px-4 py-2 text-red-500 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}
      {showForm && (
        <AddCourseForm
          onClose={handleCloseForm}
          term={term}
          isEdit={isEdit}
          course={selectedCourse}
          courseId={selectedCourseId}
        />
      )}
    </div>
  );
};

export default TermCard;
