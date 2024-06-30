import React from "react";
import TermCard from "./TermsSectionComponents/TermCard.tsx";

interface Terms {
  [key: string]: {
    name: string;
    gpa: number;
    credits: number;
    courses: {
      [key: string]: {
        subject: string;
        course_code: string;
        term: number;
        credits: number;
        grade: number;
        graded: boolean;
      };
    };
  };
}

interface TermsSectionProps {
  terms: Terms;
}

const TermsSection: React.FC<TermsSectionProps> = ({ terms }) => {
  return (
    <div className="flex flex-col items-center px-4">
      <h2 className="text-2xl font-bold mb-4">Terms</h2>
      <button className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="69"
          viewBox="0 0 72 69"
          fill="none"
        >
          <ellipse cx="36" cy="34.5" rx="36" ry="34.5" fill="#DC7041" />
          <ellipse cx="36" cy="34" rx="5" ry="32" fill="#D9D9D9" />
          <ellipse
            cx="36"
            cy="34"
            rx="5"
            ry="32"
            transform="rotate(-90 36 34)"
            fill="#D9D9D9"
          />
        </svg>
      </button>
      {Object.entries(terms).map(([term, termData]) => (
        <TermCard key={term} term={term} termData={termData} />
      ))}
    </div>
  );
};

export default TermsSection;
