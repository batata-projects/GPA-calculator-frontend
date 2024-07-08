import React, { useState } from "react";
import TermCard from "./TermsSectionComponents/TermCard.tsx";
import TermForm from "./TermsSectionComponents/TermForm.tsx";

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
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | number | boolean;
}

const TermsSection: React.FC<TermsSectionProps> = ({
  terms,
  userId,
  accessToken,
  refreshToken,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col items-center mt-7">
      <h2 className="text-2xl font-bold mb-4">Terms</h2>
      <button
        onClick={handleOpenForm}
        className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="69"
          viewBox="0 0 72 69"
          fill="none"
        >
          <ellipse cx="36" cy="34.5" rx="36" ry="34.5" fill="#f97316" />
          <ellipse cx="36" cy="34" rx="5" ry="32" fill="#ffffff" />
          <ellipse
            cx="36"
            cy="34"
            rx="5"
            ry="32"
            transform="rotate(-90 36 34)"
            fill="#ffffff"
          />
        </svg>
      </button>
      {Object.entries(terms)
        .sort(([termA], [termB]) => termB.localeCompare(termA))
        .map(([term, termData]) => (
          <TermCard
            key={term}
            term={term}
            termData={termData}
            user_id={userId}
            accessToken={accessToken}
            refreshToken={refreshToken}
          />
        ))}
      {isFormOpen && (
        <TermForm
          onClose={handleCloseForm}
          userId={userId}
          accessToken={accessToken}
          refreshToken={refreshToken}
        />
      )}
    </div>
  );
};

export default TermsSection;
