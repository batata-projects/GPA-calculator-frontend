import React, { useState, useRef } from "react";

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
      setTimeout(() => {
        scrollToBottom();
      }, 100);

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
        <div className="flex flex-row items-center bg-gray-300 py-5 px-5 rounded-[40px] w-[500px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110">
          <button
            className="mr-4 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110"
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
            className="flex-grow bg-transparent focus:outline-none"
            placeholder="Enter Course Name, Subject, or Grade..."
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="bg-[#055AC5] py-5 px-5 rounded-[40px] w-[1000px] mt-5 mb-[100px] min-h-[80px] grid grid-cols-3 justify-center gap-4 md:gap-8 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 relative">
          {filteredCourses.map((course) => (
            <div
              key={`${course.subject}-${course.course_code}`}
              className="flex flex-col items-center focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 border-2 border-white p-4 rounded-[40px]"
            >
              <div className="text-white text-[20px] mb-3">
                {formatTermName(course.term)}
              </div>
              <div className="flex flex-row space-x-2">
                <div className="bg-white text-black rounded-[40px] py-1 px-5 flex justify-center items-center text-[14px] min-w-[150px] h-[40px]">
                  {course.subject}-{course.course_code}
                </div>
                <div className="bg-white text-black rounded-full w-[40px] h-[40px] flex justify-center items-center text-[14px]">
                  {getLetterGrade(course.grade)}
                </div>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && query !== "" && (
            <div className="text-white text-center">No courses found.</div>
          )}
          {filteredCourses.length > 0 && (
            <button
              className="absolute bottom-4 right-4 bg-white text-[#055AC5] px-4 py-2 rounded-[40px] focus:outline-none transition duration-300 ease-in-out transform hover:scale-110"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuerySection;
