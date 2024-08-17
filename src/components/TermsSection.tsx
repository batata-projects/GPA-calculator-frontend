import React, { useState, useCallback } from "react";
import { useDashboard } from "../hooks/useDashboard.ts";
import TermCard from "./TermsSectionComponents/TermCard.tsx";
import TermForm from "./TermsSectionComponents/TermForm.tsx";

const TermsSection: React.FC = () => {
  const { terms } = useDashboard();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  return (
    <div className="flex flex-col items-center mt-12 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105">
        Terms
      </h2>
      <button
        onClick={handleOpenForm}
        title="Add Term"
        className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="57"
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
      <div className="space-y-6 w-full">
         {Object.entries(terms)
        .sort(([termA], [termB]) => termB.localeCompare(termA))
        .map(([term, termData]) => (
          <TermCard key={term} term={term} termData={termData} />
        ))}
      </div>
            {isFormOpen && <TermForm onClose={handleCloseForm} />}

    </div>
  );
};

export default TermsSection;
