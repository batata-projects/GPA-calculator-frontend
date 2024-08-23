export const formatTermName = (termCode: number): string => {
  const year = Math.floor(termCode / 100);
  const semester = termCode % 100;
  const semesterName =
    {
      10: "Fall",
      15: "Winter",
      20: "Spring",
      30: "Summer",
    }[semester.toString()] || "";
  return `${semesterName} ${year}`;
};

export const getLetterGrade = (
  grade: number | null,
  graded: boolean
): string => {
  if (grade === null) return "NC";
  if (graded) {
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
    };
    return gradeMapping[grade] || "NC";
  }
  if (grade === 1) return "P";
  if (grade === 0) return "F";
  if (grade === -1) return "W";
  return "NC";
};

export const parseGradeQuery = (
  query: string
): { type: string; value: string } | null => {
  const gradeRegex = /^([<>]=?|=)?([A-D][+-]?|F)$/i;
  const match = query.match(gradeRegex);
  if (match) {
    const [, operator, grade] = match;
    const type =
      {
        ">": "gt",
        ">=": "gte",
        "<": "lt",
        "<=": "lte",
        "=": "exact",
        undefined: "exact",
      }[operator] || "exact";
    return { type, value: grade.toUpperCase() };
  }
  return null;
};
