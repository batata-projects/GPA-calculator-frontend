import React from "react";
import GPAKnob from "./OverallSectionComponents/GPAKnob.tsx";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  credits: number;
  grade: number;
  gpa: number;
}

interface OverallSectionProps {
  user: User;
}

const OverallSection: React.FC<OverallSectionProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <GPAKnob value={user.gpa} />
    </div>
  );
};

export default OverallSection;
