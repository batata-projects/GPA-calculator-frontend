import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ReadMoreProps {
  summaryPath: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({ summaryPath }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetch(summaryPath)
      .then((response) => response.text())
      .then((text) => {
        setSummary(text);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading summary:", error);
        setIsLoading(false);
      });
  }, [summaryPath]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-white">
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-4 text-sm lg:text-base prose prose-invert">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>
      <button
        onClick={toggleReadMore}
        className="mt-4 bg-blue-500 text-white font-poppins text-base font-normal px-6 py-2 rounded-full shadow-lg hover:bg-blue-400 transition duration-300"
      >
        {isExpanded ? "Collapse" : "Read More"}
      </button>
    </div>
  );
};

export default ReadMore;
