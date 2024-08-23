import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.tsx";
import { Button } from "../ui/button.tsx";
import { Info } from "lucide-react";

const gradeMapping: { [key: number]: string } = {
  4.3: "A+",
  4.0: "A",
  3.7: "A-",
  3.3: "B+",
  3.0: "B",
  2.7: "B-",
  2.3: "C+",
  2.0: "C",
  1.7: "C-",
  1.3: "D+",
  1.0: "D",
  0.0: "F",
  [-1]: "W",
};

const GradingScaleButton = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Info size={16} />
          Grading Scale
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <h3 className="font-semibold mb-2">Grading Scale</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Grade</th>
              <th className="text-left">GPA</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(gradeMapping)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([gpa, grade]) => (
                <tr key={gpa}>
                  <td>{grade}</td>
                  <td>{gpa === "-1" ? "N/A" : gpa}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </PopoverContent>
    </Popover>
  );
};

export default GradingScaleButton;
