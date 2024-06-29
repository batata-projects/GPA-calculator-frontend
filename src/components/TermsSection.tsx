import React from "react";

interface Terms {
  [key: string]: Course[];
}

interface Course {
  name: string;
}
interface TermsSectionProps {
  terms: Terms;
}
const TermsSection: React.FC<TermsSectionProps> = ({ terms }) => {
  return <div>Terms</div>;
};

export default TermsSection;
