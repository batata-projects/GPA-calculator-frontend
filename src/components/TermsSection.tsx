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
    <div className="flex flex-col items-center mt-[5%]">
      <h2 className="text-[36px] font-bold mb-8 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110">
        Terms
      </h2>
      <button
        onClick={handleOpenForm}
        className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-110"
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
          <TermCard key={term} term={term} termData={termData} />
        ))}
      {/* {isFormOpen && <TermForm onClose={handleCloseForm} />} */}
    </div>
  );
};

export default TermsSection;
