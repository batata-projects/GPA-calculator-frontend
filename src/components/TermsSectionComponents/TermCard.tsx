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
    <div className="flex flex-col bg-[#055AC5] my-4 rounded-[40px] text-white w-full min-w-[300px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 element transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:border-2 hover:border-gray-700">
      <div className="flex flex-col md:flex-row flex-grow min-h-[300px]">
        <div className="w-full md:w-3/4 flex flex-col py-3">
          <div className="text-[25px] mb-6">{termData.name}</div>
          <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6">
            {Object.values(termData.courses).map((course, index) => (
              <div
                key={index}
                className="flex flex-row md:flex-row items-center space-x-2 md:space-y-0 md:space-x-2"
              >
                {/* course name */}
                <div className="bg-white text-black rounded-[40px] py-1 px-5 flex justify-center items-center text-[14px] min-w-[150px] h-[40px]">
                  <p>
                    {course.subject}-{course.course_code}
                  </p>
                </div>
                {/* course grade */}
                <div className="bg-white text-black rounded-full w-[40px] h-[40px] flex justify-center items-center text-[14px]">
                  {course.grade}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto mr-2 self-end">
            <button className="bg-orange-500 hover:bg-white hover:text-black text-white py-2 px-5 rounded-[40px] text-[14px] transition duration-300 ease-in-out transform hover:scale-110 mt-5">
              Add Course
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/4 flex flex-col p-4 md:p-8 relative text-center border-t md:border-t-0 md:border-l">
          <div className="mb-4 text-[36px] md:text-[48px] font-bold">GPA</div>
        </div>
      </div>
    </div>
  );
};

export default TermCard;
