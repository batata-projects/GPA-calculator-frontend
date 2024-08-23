import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddCourseForm from "../TermsSectionComponents/AddCourseForm.tsx";
import { useDashboard } from "../../../hooks/useDashboard.ts";
import { useCourseFilter } from "../../../hooks/useCourseFilter.ts";
import { Course } from "../../../types/index.ts";
import SearchBar from "./SearchBar.tsx";
import FilterButtons from "./FilterButtons.tsx";
import CourseList from "./CourseList.tsx";

const QuerySection: React.FC = () => {
  const resultsCardRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(false);
  const [showResultsCard, setShowResultsCard] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { terms } = useDashboard();
  const [isClearing, setIsClearing] = useState(false);
  const { filteredCourses, filterCourses } = useCourseFilter(terms);

  useEffect(() => {
    if (showResultsCard && resultsCardRef.current) {
      const timer = setTimeout(() => {
        resultsCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);

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
    setQuery("");
    setShowResultsCard(false);
  }, [terms]);

  useEffect(() => {
    if (!selectedCourse) {
      setSelectedCourseId(null);
    }
  }, [selectedCourse]);

  const handleClear = () => {
    setIsClearing(true);
    setTimeout(() => {
      setQuery("");
      filterCourses("", []);
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
      filterCourses(query, newFilters);
      return newFilters;
    });
  };

  const handleCourseUpdated = useCallback(() => {
    // Refetch the filtered courses
    filterCourses(query, selectedFilters);
    // Close the form
    handleCloseForm();
  }, [query, selectedFilters, filterCourses]);

  const handleSearch = () => {
    filterCourses(query, selectedFilters);
    setHasSubmittedQuery(true);
    setShowResultsCard(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h2 className="text-[36px] font-bold mb-5 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110">
        Query
      </h2>

      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            onKeyPress={handleKeyPress}
          />
          <p className="text-sm text-gray-400 mt-2">
            Tip: Use '{">"}', '{">"}=', '{"<"}', '{"<"}=', or '=' followed by a
            grade (e.g., {">"}=B+) for grade comparisons.
          </p>
          <FilterButtons
            selectedFilters={selectedFilters}
            onFilterSelect={handleFilterSelect}
          />
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
                <CourseList
                  filteredCourses={filteredCourses}
                  selectedCourseId={selectedCourseId}
                  onCourseClick={handleCourseClick}
                />
                <AnimatePresence>
                  {selectedCourse && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AddCourseForm
                        term={String(selectedCourse.term)}
                        onClose={handleCloseForm}
                        isEdit={true}
                        course={selectedCourse}
                        courseId={selectedCourseId}
                        onCourseUpdated={handleCourseUpdated}
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
