import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  const editFormRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<FilteredCourses>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(false);
  const [showResultsCard, setShowResultsCard] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // useEffects
  useEffect(() => {
    if (selectedCourse && editFormRef.current) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "end",
      };
      editFormRef.current.scrollIntoView(scrollOptions);
    }
  }, [selectedCourse]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [filteredCourses]);

  //  Handles
  const handleClear = () => {
    setQuery("");
    setFilteredCourses({});
    setSelectedFilters([]);
    setHasSubmittedQuery(false);
    setShowResultsCard(false);
    setSelectedCourseId(null);
    setSelectedCourse(null);
  };

  const handleCourseClick = (courseId: string, course: Course) => {
    if (selectedCourseId === courseId) {
      setSelectedCourse(null);
      setSelectedCourseId(null);
    } else {
      console.log(courseId);
      setSelectedCourse(course);
      setSelectedCourseId(courseId);
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

      // Re-run the search with the new filters
      const courses = filterCourses(query, newFilters);
      setFilteredCourses(courses);

      return newFilters;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
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

  const handleClearFilters = () => {
    setSelectedFilters([]);
    const courses = filterCourses(query, []);
    setFilteredCourses(courses);
  };

  // Functions

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const formatTermName = (termCode: number) => {
    const year = Math.floor(termCode / 100);
    const semester = termCode % 100;
    const semesterName = termMapping[semester.toString()];
    return `${semesterName} ${year}`;
  };

  const getLetterGrade = (
    grade: number,
    graded: boolean
  ): { display: string; title: string } => {
    if (graded) {
      return {
        display: gradeMapping[grade] || "N/A",
        title: gradeMapping[grade] || "Not Available",
      };
    } else {
      if (grade === 1) return { display: "P", title: "Pass" };
      if (grade === 0) return { display: "F", title: "Fail" };
      if (grade === -1) return { display: "W", title: "Withdraw" };
      return { display: "N/A", title: "Not Available" };
    }
  };

  const scrollToBottom = () => {
    if (resultsCardRef.current) {
      const resultsCard = resultsCardRef.current;
      const scrollPosition =
        resultsCard.offsetTop + resultsCard.offsetHeight + 20; // Adjust the value (e.g., 20) to control the extra scroll distance
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
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
        const gradeInfo = getLetterGrade(grade, graded);
        const courseName = `${subject}-${course_code}`;

        if (
          subject.toUpperCase().includes(searchQuery.toUpperCase()) ||
          courseName.toUpperCase().includes(searchQuery.toUpperCase()) ||
          gradeInfo.display.includes(searchQuery.toUpperCase()) ||
          gradeInfo.title.toUpperCase().includes(searchQuery.toUpperCase())
        ) {
          filteredCourses[courseKey] = course;
        }
      });
    });

    // Apply sorting and grouping based on filters
    if (filters.includes("gradeAscending")) {
      filteredCourses = Object.fromEntries(
        Object.entries(filteredCourses).sort((a, b) => {
          if (a[1].graded && b[1].graded) {
            return a[1].grade - b[1].grade;
          } else if (!a[1].graded && !b[1].graded) {
            return a[1].grade - b[1].grade;
          } else if (a[1].graded) {
            return -1;
          } else {
            return 1;
          }
        })
      );
    } else if (filters.includes("gradeDescending")) {
      filteredCourses = Object.fromEntries(
        Object.entries(filteredCourses).sort((a, b) => {
          if (a[1].graded && b[1].graded) {
            return b[1].grade - a[1].grade;
          } else if (!a[1].graded && !b[1].graded) {
            return b[1].grade - a[1].grade;
          } else if (b[1].graded) {
            return 1;
          } else {
            return -1;
          }
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
    <div className="flex flex-col items-center mt-5">
      <h2 className="text-2xl font-bold mt-5 mb-10">Query</h2>
      <div
        className={`flex flex-col items-center ${
          showResultsCard ? "" : "mb-[100px]"
        }`}
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center bg-gray-300 rounded-[40px] w-[500px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110">
          <div className="col-span-1">
            <button
              className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 px-4 py-5"
              onClick={handleSearch}
              title="Search"
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
          <div className="col-span-1">
            <input
              className="w-full bg-transparent focus:outline-none text-[20px] py-5"
              placeholder="Enter Course Name, Subject, or Grade..."
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div ref={dropdownRef} className="col-span-1 relative">
            <button
              className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 px-4 py-5"
              onClick={toggleFilter}
              title="Filter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </button>
            {isFilterOpen && (
              <div className="absolute bottom-[65%] left-[50%] mb-2 bg-white rounded shadow-md z-50">
                <div className="flex flex-row p-2 border-b space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 mt-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  <div className="text-[20px] font-semibold">Filter</div>
                </div>

                <div className="py-2">
                  <div className="font-semibold px-4 py-2">Filter by:</div>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <input
                      type="radio"
                      name="filter"
                      value="term"
                      checked={selectedFilters.includes("term")}
                      onChange={() => handleFilterSelect("term")}
                      className="mr-2"
                    />
                    <span>Terms</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <input
                      type="radio"
                      name="filter"
                      value="subject"
                      checked={selectedFilters.includes("subject")}
                      onChange={() => handleFilterSelect("subject")}
                      className="mr-2"
                    />
                    <span>Subject</span>
                  </label>
                </div>
                <div className="py-2">
                  <div className="font-semibold px-4 py-2">Sort by grade:</div>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <input
                      type="radio"
                      name="sort"
                      value="gradeAscending"
                      checked={selectedFilters.includes("gradeAscending")}
                      onChange={() => handleFilterSelect("gradeAscending")}
                      className="mr-2"
                    />
                    <span>Ascending</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <input
                      type="radio"
                      name="sort"
                      value="gradeDescending"
                      checked={selectedFilters.includes("gradeDescending")}
                      onChange={() => handleFilterSelect("gradeDescending")}
                      className="mr-2"
                    />
                    <span>Descending</span>
                  </label>
                </div>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md ml-2 mb-3"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
        {showResultsCard && (
          <motion.div
            ref={resultsCardRef}
            className="flex flex-col results-card bg-[#055AC5] py-6 px-8 rounded-[40px] w-[1000px] mt-10 mb-[100px] min-h-[80px] justify-center focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 relative scroll-smooth"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {hasSubmittedQuery && Object.keys(filteredCourses).length === 0 ? (
              <div className="text-white text-center">No courses found.</div>
            ) : (
              <>
                {!selectedFilters.includes("term") &&
                  !selectedFilters.includes("subject") && (
                    <div className="grid grid-cols-3 gap-4 md:gap-9">
                      {Object.keys(filteredCourses).map((courseId) => {
                        const course = filteredCourses[courseId] as Course;
                        return (
                          <motion.div
                            key={courseId}
                            className="flex flex-col items-center border-2 text-white border-white p-4 rounded-[40px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 hover:bg-orange-500"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.6,
                              delay: 0.15 * 3,
                              ease: "easeInOut",
                            }}
                            whileHover={{ scale: 1.15 }}
                            onClick={() => handleCourseClick(courseId, course)}
                          >
                            <div className="text-[20px] mb-3">
                              {formatTermName(course.term)}
                            </div>
                            <div className="flex flex-row space-x-2">
                              <div className="bg-white text-black rounded-[40px] py-1 px-5 flex justify-center items-center text-[14px] min-w-[150px] h-[40px] transition duration-300 ease-in-out">
                                {course.subject}-{course.course_code}
                              </div>
                              <div
                                className="bg-white text-black rounded-full w-[40px] h-[40px] flex justify-center items-center text-[14px] transition duration-300 ease-in-out"
                                title={
                                  getLetterGrade(course.grade, course.graded)
                                    .title
                                }
                              >
                                {
                                  getLetterGrade(course.grade, course.graded)
                                    .display
                                }
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                {(selectedFilters.includes("term") ||
                  selectedFilters.includes("subject")) && (
                  <>
                    {Object.keys(filteredCourses).map((groupKey) => (
                      <div key={groupKey} className="mb-6">
                        <div className="text-white text-xl font-bold mb-4">
                          {groupKey}
                        </div>
                        <div className="grid grid-cols-3 gap-4 md:gap-9">
                          {Object.keys(
                            filteredCourses[groupKey] as {
                              [key: string]: Course;
                            }
                          ).map((courseId) => {
                            const course = (
                              filteredCourses[groupKey] as {
                                [key: string]: Course;
                              }
                            )[courseId];
                            return (
                              <motion.div
                                key={courseId}
                                className="flex flex-col items-center border-2 text-white border-white p-4 rounded-[40px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 hover:bg-orange-500"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.6,
                                  delay: 0.15 * 3,
                                  ease: "easeInOut",
                                }}
                                whileHover={{ scale: 1.15 }}
                                onClick={() =>
                                  handleCourseClick(courseId, course)
                                }
                              >
                                <div className="text-[20px] mb-3">
                                  {formatTermName(course.term)}
                                </div>
                                <div className="flex flex-row space-x-2">
                                  <div className="bg-white text-black rounded-[40px] py-1 px-5 flex justify-center items-center text-[14px] min-w-[150px] h-[40px] transition duration-300 ease-in-out">
                                    {course.subject}-{course.course_code}
                                  </div>
                                  <div
                                    className="bg-white text-black rounded-full w-[40px] h-[40px] flex justify-center items-center text-[14px] transition duration-300 ease-in-out"
                                    title={
                                      getLetterGrade(
                                        course.grade,
                                        course.graded
                                      ).title
                                    }
                                  >
                                    {
                                      getLetterGrade(
                                        course.grade,
                                        course.graded
                                      ).display
                                    }
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
            <div className="flex justify-center mt-5">
              {(Array.isArray(filteredCourses) && filteredCourses.length > 0) ||
              (!Array.isArray(filteredCourses) &&
                Object.keys(filteredCourses).length > 0) ? (
                <motion.button
                  className="w-[10%] bg-white text-[#055AC5] px-4 py-2 rounded-[40px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: Array.isArray(filteredCourses)
                      ? 0.15 * filteredCourses.length
                      : 0.15 * Object.values(filteredCourses).flat().length,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleClear}
                >
                  Clear
                </motion.button>
              ) : null}
            </div>
            <div ref={editFormRef}>
              {selectedCourse && (
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
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuerySection;
