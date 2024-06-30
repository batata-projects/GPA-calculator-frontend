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

const TermCard: React.FC<TermCardProps> = ({ term, termData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">{termData.name}</h3>
      <p className="mb-2">GPA: {termData.gpa}</p>
      <p className="mb-2">Credits: {termData.credits}</p>
      <ul>
        {Object.values(termData.courses).map((course, index) => (
          <li key={index} className="mb-1">
            {course.subject} {course.course_code}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TermCard;
