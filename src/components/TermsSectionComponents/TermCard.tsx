import React from "react";

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

interface TermCardProps {
  term: string;
  termData: TermData;
}

const TermCard: React.FC<TermCardProps> = ({ termData }) => {
  return (
    <div className="bg-[#055AC5] rounded-2xl shadow-md p-8 mb-4 w-full max-w-screen-xl mx-auto flex-grow flex-shrink">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white">{termData.name}</h3>
      </div>
      {/* course and gpa container */}
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* course side */}
        <div className="w-full md:w-4/5 md:pr-6 flex flex-col">
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.values(termData.courses).map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 flex justify-between items-center text-[14px]"
                >
                  <p className="text-gray-800 font-bold">
                    {course.subject} {course.course_code}
                  </p>
                  <p className="text-gray-800 font-bold">{course.grade}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button className="bg-white text-[#2a4193] font-bold py-3 px-6 rounded-lg text-lg">
              Add Course
            </button>
          </div>
        </div>
        {/* vertical span */}
        <div className="hidden md:block w-px bg-white mx-8"></div>
        {/* horizontal span */}
        <div className="md:hidden h-px bg-white my-8"></div>
        {/* gpa side */}
        <div className="w-full md:w-1/5 mt-6 md:mt-0">
          <div className="bg-[#FF9500] text-white rounded-lg p-6">
            <p className="text-3xl font-bold mb-4 text-center">GPA</p>
            <p className="text-5xl font-bold text-center">{termData.gpa}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermCard;
