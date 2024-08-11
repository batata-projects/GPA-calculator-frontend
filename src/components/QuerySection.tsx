import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddCourseForm from "../components/TermsSectionComponents/AddCourseForm.tsx";

interface Course {
  subject: string;
  course_code: string;
  term: number;
  credits: number;
  grade: number;
  graded: boolean;
}

interface Terms {
  [key: string]: {
    name: string;
    gpa: number;
    credits: number;
    courses: {
      [key: string]: Course;
    };
  };
}

interface QuerySectionProps {
  terms: Terms;
  user_id: string | null;
  refreshToken: string | number | boolean;
  accessToken: string | null;
}

const termMapping: { [key: string]: string } = {
  "10": "Fall",
  "15": "Winter",
  "20": "Spring",
  "30": "Summer",
};

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

interface FilteredCourses {
  [key: string]: Course | { [key: string]: Course };
}

const QuerySection: React.FC<QuerySectionProps> = ({
  terms,
  user_id,
  accessToken,
  refreshToken,
}) => {
  const resultsCardRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<FilteredCourses>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(false);
  const [showResultsCard, setShowResultsCard] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  // useEffect for scrolling to results
  useEffect(() => {
    if (showResultsCard && resultsCardRef.current) {
      const timer = setTimeout(() => {
        resultsCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100); // Short delay to ensure the content is rendered

      return () => clearTimeout(timer);
    }
  }, [showResultsCard]);

  const scrollToBottom = () => {
    if (resultsCardRef.current) {
      resultsCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (!selectedCourse) {
      setSelectedCourseId(null);
    }
  }, [selectedCourse]);

  const handleClear = () => {
    setIsClearing(true);
    setTimeout(() => {
      setQuery("");
      setFilteredCourses({});
      setSelectedFilters([]);
      setHasSubmittedQuery(false);
      setShowResultsCard(false);
      setSelectedCourseId(null);
      setSelectedCourse(null);
      setIsClearing(false);
    }, 300);
  };

  const handleCourseClick = (courseId: string, course: Course) => {
    if (selectedCourseId === courseId) {
      setSelectedCourse(null);
      setSelectedCourseId(null);
    } else {
      setSelectedCourse(course);
      setSelectedCourseId(courseId);
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  };

  const handleCloseForm = () => {
    setSelectedCourse(null);
    setSelectedCourseId(null);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilters((prevFilters) => {
      let newFilters;
      if (prevFilters.includes(filter)) {
        newFilters = prevFilters.filter((f) => f !== filter);
      } else {
        if (filter === "term" || filter === "subject") {
          newFilters = [
            ...prevFilters.filter((f) => f !== "term" && f !== "subject"),
            filter,
          ];
        } else if (
          filter === "gradeAscending" ||
          filter === "gradeDescending"
        ) {
          newFilters = [
            ...prevFilters.filter(
              (f) => f !== "gradeAscending" && f !== "gradeDescending"
            ),
            filter,
          ];
        } else {
          newFilters = [...prevFilters, filter];
        }
      }
      const courses = filterCourses(query, newFilters);
      setFilteredCourses(courses);
      return newFilters;
    });
  };

  const handleSearch = () => {
    const courses = filterCourses(query, selectedFilters);
    setFilteredCourses(courses);
    setHasSubmittedQuery(true);
    setShowResultsCard(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const formatTermName = (termCode: number) => {
    const year = Math.floor(termCode / 100);
    const semester = termCode % 100;
    const semesterName = termMapping[semester.toString()];
    return `${semesterName} ${year}`;
  };

  const getLetterGrade = (grade: number | null, graded: boolean): string => {
    if (grade === null) return "NC";
    if (graded) return gradeMapping[grade] || "NC";
    if (grade === 1) return "P";
    if (grade === 0) return "F";
    if (grade === -1) return "W";
    return "NC";
  };

  const filterCourses = (
    searchQuery: string,
    filters: string[]
  ): FilteredCourses => {
    let filteredCourses: { [key: string]: Course } = {};

    Object.keys(terms).forEach((termKey) => {
      const term = terms[termKey];
      Object.keys(term.courses).forEach((courseKey) => {
        const course = term.courses[courseKey];
        const { subject, course_code, grade, graded } = course;
        const gradeDisplay = getLetterGrade(grade, graded);
        const courseName = `${subject}-${course_code}`;

        if (
          subject.toUpperCase().includes(searchQuery.toUpperCase()) ||
          courseName.toUpperCase().includes(searchQuery.toUpperCase()) ||
          gradeDisplay.toUpperCase().includes(searchQuery.toUpperCase())
        ) {
          filteredCourses[courseKey] = course;
        }
      });
    });

    if (filters.includes("gradeAscending")) {
      filteredCourses = Object.fromEntries(
        Object.entries(filteredCourses).sort((a, b) => {
          if (a[1].grade === null) return 1;
          if (b[1].grade === null) return -1;
          return a[1].grade - b[1].grade;
        })
      );
    } else if (filters.includes("gradeDescending")) {
      filteredCourses = Object.fromEntries(
        Object.entries(filteredCourses).sort((a, b) => {
          if (a[1].grade === null) return 1;
          if (b[1].grade === null) return -1;
          return b[1].grade - a[1].grade;
        })
      );
    }

    if (filters.includes("term")) {
      const groupedCourses: { [key: string]: { [key: string]: Course } } = {};
      Object.entries(filteredCourses).forEach(([courseKey, course]) => {
        const termName = formatTermName(course.term);
        if (!groupedCourses[termName]) groupedCourses[termName] = {};
        groupedCourses[termName][courseKey] = course;
      });
      return groupedCourses;
    } else if (filters.includes("subject")) {
      const groupedCourses: { [key: string]: { [key: string]: Course } } = {};
      Object.entries(filteredCourses).forEach(([courseKey, course]) => {
        const { subject } = course;
        if (!groupedCourses[subject]) groupedCourses[subject] = {};
        groupedCourses[subject][courseKey] = course;
      });
      return groupedCourses;
    }

    return filteredCourses;
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      {/* section title */}
      <h2 className="text-[36px] font-bold mb-5 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110">
        Query
      </h2>

      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          {/* search bar */}
          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
            <input
              className="flex-grow bg-transparent px-6 py-4 text-lg focus:outline-none text-gray-800"
              placeholder="Enter Course Name, Subject, or Grade..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 transition duration-300 ease-in-out"
              onClick={handleSearch}
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* filters */}
          <div className="mt-4 flex flex-row items-start">
            <div>
              <span className="text-sm font-semibold text-gray-700">
                Group By:
              </span>
              <div className="flex flex-row gap-2 mt-1">
                {["term", "subject"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedFilters.includes(filter)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } transition duration-300 ease-in-out`}
                    onClick={() => handleFilterSelect(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-4 self-stretch flex items-center">
              <div className="w-px bg-gray-300 h-full"></div>
            </div>

            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-700">
                Sort By Grade:
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {["gradeAscending", "gradeDescending"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedFilters.includes(filter)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } transition duration-300 ease-in-out`}
                    onClick={() => handleFilterSelect(filter)}
                  >
                    {filter === "gradeAscending"
                      ? "Lowest to Highest"
                      : "Highest to Lowest"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showResultsCard && (
          <motion.div
            ref={resultsCardRef}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl text-white p-6 mb-8"
            initial={{ opacity: 0, y: 20, scale: 1 }}
            animate={{
              opacity: isClearing ? 0 : 1,
              y: isClearing ? 20 : 0,
              scale: isClearing ? 0.8 : 1,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold mb-6">Search Results</h3>
            {hasSubmittedQuery && Object.keys(filteredCourses).length === 0 ? (
              <div className="text-center text-xl">No courses found.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {Object.entries(filteredCourses).map(([key, value]) => {
                    if (typeof value === "object" && "subject" in value) {
                      // This is a course
                      const course = value as Course;
                      return (
                        <div
                          key={key}
                          className={`flex items-center justify-between bg-white/10 rounded-lg p-3 transition duration-300 ease-in-out transform hover:scale-102 hover:bg-white/20 ${
                            selectedCourseId === key
                              ? "ring-2 ring-yellow-400"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                              {course.subject.slice(0, 2)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">
                                {course.subject} {course.course_code}
                              </h4>
                              <p className="text-xs text-blue-200">
                                {course.credits} credit
                                {course.credits !== 1 ? "s" : ""} |{" "}
                                {formatTermName(course.term)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleCourseClick(key, course)}
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
                              title={getLetterGrade(
                                course.grade,
                                course.graded
                              )}
                            >
                              {getLetterGrade(course.grade, course.graded)}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // This is a group (term or subject)
                      return (
                        <div key={key} className="col-span-full">
                          <h4 className="text-xl font-semibold mb-2">{key}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(
                              value as { [key: string]: Course }
                            ).map(([courseKey, course]) => (
                              <div
                                key={courseKey}
                                className={`flex items-center justify-between bg-white/10 rounded-lg p-3 transition duration-300 ease-in-out transform hover:scale-102 hover:bg-white/20 ${
                                  selectedCourseId === courseKey
                                    ? "ring-2 ring-yellow-400"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                                    {course.subject.slice(0, 2)}
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-sm">
                                      {course.subject} {course.course_code}
                                    </h5>
                                    <p className="text-xs text-blue-200">
                                      {course.credits} credit
                                      {course.credits !== 1 ? "s" : ""} |{" "}
                                      {formatTermName(course.term)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      handleCourseClick(courseKey, course)
                                    }
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
                                    title={getLetterGrade(
                                      course.grade,
                                      course.graded
                                    )}
                                  >
                                    {getLetterGrade(
                                      course.grade,
                                      course.graded
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                <AnimatePresence>
                  {selectedCourse && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AddCourseForm
                        user_id={user_id}
                        accessToken={accessToken}
                        refreshToken={refreshToken}
                        term={String(selectedCourse.term)}
                        onClose={handleCloseForm}
                        isEdit={true}
                        course={selectedCourse}
                        courseId={selectedCourseId}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
            <div className="mt-6 flex justify-center">
              <button
                className="bg-white text-blue-800 px-6 py-2 rounded-full hover:bg-blue-100 transition duration-300 ease-in-out"
                onClick={handleClear}
                disabled={isClearing}
              >
                Clear Results
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuerySection;
