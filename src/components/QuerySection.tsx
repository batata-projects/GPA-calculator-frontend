import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Course {
  subject: string;
  course_code: string;
  term: number;
  credits: number;
  grade: number;
  graded: boolean;
}

interface TermData {
  name: string;
  gpa: number;
  credits: number;
  courses: {
    [key: string]: Course;
  };
}

interface QuerySectionProps {
  termsData: TermData[];
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
};

const QuerySection: React.FC<QuerySectionProps> = ({ termsData }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const handleClear = () => {
    setQuery("");
    setFilteredCourses([]);
  };

  const formatTermName = (termCode: number) => {
    const year = Math.floor(termCode / 100);
    const semester = termCode % 100;
    const semesterName = termMapping[semester.toString()];
    return `${semesterName} ${year}`;
  };

  const getLetterGrade = (grade: number) => {
    return gradeMapping[grade] || "N/A";
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    const courses = filterCourses();
    setFilteredCourses(courses);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const filterCourses = () => {
    const courses = termsData.flatMap((term) => Object.values(term.courses));
    const uppercaseQuery = query.toUpperCase();

    const filteredCourses = courses.filter((course) => {
      const { subject, course_code, grade } = course;
      const letterGrade = getLetterGrade(grade);
      const courseName = `${subject}-${course_code}`;
      // setTimeout(() => {
      //   scrollToBottom();
      // }, 100);

      return (
        subject.toUpperCase() === uppercaseQuery ||
        courseName.toUpperCase() === uppercaseQuery ||
        letterGrade === uppercaseQuery
      );
    });

    return filteredCourses;
  };

  const scrollToBottom = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  return (
    <div ref={cardRef} className="flex flex-col items-center mt-5">
      <h2 className="text-2xl font-bold mt-5 mb-10">Query</h2>
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center bg-gray-300 rounded-[40px] w-[500px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110">
          <button
            className="mr-4 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 pl-5 py-5"
            onClick={handleSearch}
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
          <input
            className="flex-grow bg-transparent focus:outline-none text-[20px]"
            placeholder="Enter Course Name, Subject, or Grade..."
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
        <motion.div
          className="flex flex-col results-card bg-[#055AC5] py-5 px-5 rounded-[40px] w-[1000px] mt-8 mb-[100px] min-h-[80px] justify-center focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 relative"
          initial={{ maxHeight: "80px", opacity: 0 }}
          animate={{
            maxHeight: filteredCourses.length > 0 ? "500px" : "80px",
            opacity: 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8 ">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={`${course.subject}-${course.course_code}`}
                className="flex flex-col items-center border-2 text-white border-white p-4 rounded-[40px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 hover:bg-orange-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 * index,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.15 }}
              >
                <div className="text-[20px] mb-3">
                  {formatTermName(course.term)}
                </div>
                <div className="flex flex-row space-x-2">
                  <div className="bg-white text-black rounded-[40px] py-1 px-5 flex justify-center items-center text-[14px] min-w-[150px] h-[40px] transition duration-300 ease-in-out">
                    {course.subject}-{course.course_code}
                  </div>
                  <div className="bg-white text-black rounded-full w-[40px] h-[40px] flex justify-center items-center text-[14px] transition duration-300 ease-in-out">
                    {getLetterGrade(course.grade)}
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredCourses.length === 0 && query !== "" && (
              <div className="text-white text-center">No courses found.</div>
            )}
          </div>
          <div className=" flex justify-center mt-5">
            {filteredCourses.length > 0 && (
              <motion.button
                className="w-[10%] bg-white text-[#055AC5] px-4 py-2 rounded-[40px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 * filteredCourses.length,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.05 }}
                onClick={handleClear}
              >
                Clear
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuerySection;
