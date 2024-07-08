import React, { useState } from "react";
import AddCourseForm from "./AddCourseForm.tsx";

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
  user_id: string | null;
  accessToken: string | null;
  refreshToken: string | number | boolean;
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
};

const TermCard: React.FC<TermCardProps> = ({
  termData,
  user_id,
  accessToken,
  refreshToken,
  term,
}) => {
  const [showForm, setShowForm] = useState(false);

  const handleAddCourse = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="flex flex-col bg-[#055AC5] my-8 rounded-[40px] text-white w-full min-w-[300px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] max-w-[1000px] mx-auto px-4 sm:px-6 sm:pr-0 lg:px-0  element transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:border-2 hover:border-gray-700 mb-3">
      <div className="flex flex-col md:flex-row flex-grow min-h-[300px]">
        {/* course side */}
        <div className="w-full md:w-3/4 flex flex-col py-3 pl-5">
          {/* term name */}
          <div className="text-[25px] mb-6 text-center lg:text-start md:text-start sm:text-center">
            {termData.name}
          </div>
          {/* courses */}
          <div className="flex flex-col items-center md:flex-row md:flex-wrap gap-4 md:gap-6">
            {Object.values(termData.courses).map((course, index) => (
              <div
                key={index}
                className="flex flex-row items-center md:items-center space-x-2"
              >
                {/* course name */}
                <div className="bg-white text-black rounded-[40px] py-1 px-5 flex justify-center items-center text-[14px] min-w-[150px] h-[40px]">
                  <p>
                    {course.subject}-{course.course_code}
                  </p>
                </div>
                {/* course grade */}
                <div className="bg-white text-black rounded-full w-[40px] h-[40px] flex justify-center items-center text-[14px]">
                  {gradeMapping[course.grade] || "N/A"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto mr-2 md:self-end self-center">
            <button
              onClick={handleAddCourse}
              className="bg-orange-500 hover:bg-white hover:text-black text-white py-2 px-5 rounded-[40px] text-[14px] transition duration-300 ease-in-out transform hover:scale-110 mt-5"
            >
              Add Course
            </button>
          </div>
        </div>
        {/* gpa side */}
        <div className="w-full md:w-1/4 flex flex-col p-4 md:p-8 relative items-center border-t md:border-t-0 md:border-l">
          <div className="my-2 text-[36px] md:text-[48px] lg:my-4  font-bold">
            GPA
          </div>
          <div className="flex justify-center items-center bg-orange-500 rounded-[40px] h-[60px] sm:h-[70px] md:h-[80px] w-[120px] sm:w-[130px] md:w-[140px] text-[24px] sm:text-[28px] md:text-[32px] px-4 overflow-hidden">
            {termData.gpa.toFixed(2)}
          </div>
        </div>
      </div>
      {showForm && (
        <AddCourseForm
          user_id={user_id}
          onClose={handleCloseForm}
          term={term}
          accessToken={accessToken}
          refreshToken={refreshToken}
        />
      )}
    </div>
  );
};

export default TermCard;
