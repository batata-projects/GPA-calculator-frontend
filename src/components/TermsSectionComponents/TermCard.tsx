import React, { useState, useRef, useCallback, useEffect } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteTerm = useCallback(async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the ${termData.name} term and all its associated courses?`
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
  }, [
    termData.courses,
    fetchDashboardData,
    accessToken,
    refreshToken,
    termData.name,
  ]);

  const handleAddCourse = useCallback(
    (courseId?: string, course?: Course) => {
      if (showForm && courseId === selectedCourseId) {
        setShowForm(false);
        setIsEdit(false);
        setSelectedCourse(null);
        setSelectedCourseId(null);
      } else {
        setIsEdit(course !== undefined);
        setShowForm(true);
        setIsFormOpen(course === undefined);
        setSelectedCourse(course || null);
        setSelectedCourseId(courseId || null);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    },
    [showForm, selectedCourseId]
  );

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedCourse(null);
    setSelectedCourseId(null);
    setIsFormOpen(false);
  }, []);

  const handleAddOrCancel = () => {
    if (isFormOpen) {
      handleCloseForm();
    } else {
      handleAddCourse();
    }
  };

  const sortCourses = (courses: { [key: string]: Course }) => {
    return Object.entries(courses).sort(([, courseA], [, courseB]) => {
      if (courseA.grade === null && courseB.grade === null) return 0;
      if (courseA.grade === null) return 1;
      if (courseB.grade === null) return -1;
      if (courseA.graded && courseB.graded) {
        return courseB.grade - courseA.grade;
      } else if (courseA.graded) {
        return -1;
      } else if (courseB.graded) {
        return 1;
      } else {
        return courseB.grade - courseA.grade;
      }
    });
  };

  const scrollToBottom = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getTotalCredits = () => {
    return Object.values(termData.courses).reduce(
      (total, course) => total + course.credits,
      0
    );
  };

  return (
    <div
      ref={cardRef}
      className="flex flex-col bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl text-white w-full max-w-4xl mx-auto p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left side: Term name and courses */}
        <div className="w-full lg:w-3/4 pr-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/30">
            <h2 className="text-3xl font-bold">{termData.name}</h2>
            <button
              onClick={toggleExpand}
              className="lg:hidden bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition duration-300 ease-in-out"
            >
              {isExpanded ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>
          </div>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              isExpanded ? "" : "max-h-96 overflow-y-auto"
            }`}
          >
            {sortCourses(termData.courses).map(([courseId, course]) => (
              <div
                key={courseId}
                className={`flex items-center justify-between bg-white/10 rounded-lg p-3 transition duration-300 ease-in-out transform hover:scale-102 hover:bg-white/20 ${
                  selectedCourseId === courseId
                    ? "border-2 border-yellow-400"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                    {course.subject.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      {course.subject} {course.course_code}
                    </h3>
                    <p className="text-xs text-blue-200">
                      {course.credits} credit{course.credits !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddCourse(courseId, course)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-blue-800 p-1.5 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
                    title="Edit course"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                      course.grade === null
                        ? "bg-gray-400 text-gray-800"
                        : "bg-white text-blue-800"
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
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleAddOrCancel}
              className={`${
                isFormOpen
                  ? "bg-red-500 hover:bg-white hover:text-red-500"
                  : "bg-green-500 hover:bg-white hover:text-green-500"
              } text-white py-2 px-6 rounded-full text-sm transition duration-300 ease-in-out transform hover:scale-105`}
            >
              {isFormOpen ? "Cancel" : "Add Another Course"}
            </button>
            <p className="text-sm text-blue-200">
              Total Credits: {getTotalCredits()}
            </p>
          </div>
        </div>

        {/* Right side: GPA */}
        <div className="w-full lg:w-1/4 mt-6 lg:mt-0 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-white/30 pt-6 lg:pt-0 lg:pl-6">
          <h3 className="text-2xl font-semibold mb-4">Term GPA</h3>
          <div className="relative w-32 h-32 group">
            <div className="absolute inset-0 bg-white rounded-full transition-all duration-300 ease-in-out transform group-hover:scale-110 group-hover:shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-800 transition-all duration-300 ease-in-out transform group-hover:scale-110">
                {(Math.floor(termData.gpa * 100) / 100).toFixed(2)}
              </span>
            </div>
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 transition-all duration-300 ease-in-out transform scale-0 group-hover:scale-100"></div>
          </div>
          <button
            onClick={handleDeleteTerm}
            className="mt-6 text-red-300 hover:text-red-500 transition duration-300 ease-in-out transform hover:scale-110"
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
        </div>
      </div>
      {error && (
        <div className="px-4 py-2 text-red-500 bg-red-100 border border-red-400 rounded-full text-sm mt-4">
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
