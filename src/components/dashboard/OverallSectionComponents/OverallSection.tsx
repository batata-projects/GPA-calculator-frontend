import React from "react";
import { useDashboard } from "../../../hooks/useDashboard.ts";
import GPAKnob from "./GPAKnob.tsx";
import Loader from "../../common/Loader.tsx";

const OverallSection: React.FC = () => {
  const { user } = useDashboard();

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <GPAKnob value={user.gpa} />
    </div>
  );
};

export default OverallSection;
