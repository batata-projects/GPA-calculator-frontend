import React from "react";
import TermManagement from "./TermManagement.tsx";

const TermsSection: React.FC = () => {
  return (
    <TermManagement
      title="Terms"
      showAddButton={true}
      termSortOrder="desc"
      onTermAdded={() => console.log("Term added")}
      onTermDeleted={() => console.log("Term deleted")}
      onTermUpdated={() => console.log("Term updated")}
    />
  );
};

export default TermsSection;
