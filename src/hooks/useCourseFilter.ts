import { useState, useCallback } from "react";
import { Terms, FilteredCourses, Course } from "../types";
import {
  parseGradeQuery,
  getLetterGrade,
  formatTermName,
} from "../utils/functions.ts";
import { GRADE_ORDER } from "../constants/index.ts";

export const useCourseFilter = (terms: Terms) => {
  const [filteredCourses, setFilteredCourses] = useState<FilteredCourses>({});

  const filterCourses = useCallback(
    (searchQuery: string, filters: string[]): void => {
      let newFilteredCourses: { [key: string]: Course } = {};

      const normalizedQuery = searchQuery.toLowerCase().trim();
      const gradeFilter = parseGradeQuery(normalizedQuery);

      const fullCourseNameRegex = /^([a-z]+)\s*(\d+)$/i;
      const fullCourseNameMatch = normalizedQuery.match(fullCourseNameRegex);

      Object.keys(terms).forEach((termKey) => {
        const term = terms[termKey];
        Object.keys(term.courses).forEach((courseKey) => {
          const course = term.courses[courseKey];
          const { subject, course_code, grade, graded } = course;
          const gradeDisplay = getLetterGrade(grade, graded);
          const courseName = `${subject}-${course_code}`;

          let matches = false;

          if (gradeFilter) {
            const courseGradeIndex = GRADE_ORDER.indexOf(gradeDisplay);
            const filterGradeIndex = GRADE_ORDER.indexOf(gradeFilter.value);

            switch (gradeFilter.type) {
              case "gt":
                matches = courseGradeIndex < filterGradeIndex;
                break;
              case "gte":
                matches = courseGradeIndex <= filterGradeIndex;
                break;
              case "lt":
                matches = courseGradeIndex > filterGradeIndex;
                break;
              case "lte":
                matches = courseGradeIndex >= filterGradeIndex;
                break;
              case "exact":
                matches = gradeDisplay === gradeFilter.value;
                break;
            }
          } else if (fullCourseNameMatch) {
            const [, querySubject, queryCourseCode] = fullCourseNameMatch;
            matches =
              subject.toLowerCase() === querySubject.toLowerCase() &&
              course_code.toLowerCase() === queryCourseCode.toLowerCase();
          } else {
            matches =
              subject.toLowerCase() === normalizedQuery ||
              course_code.toLowerCase() === normalizedQuery ||
              courseName.toLowerCase().includes(normalizedQuery);
          }

          if (matches) {
            newFilteredCourses[courseKey] = course;
          }
        });
      });

      if (filters.includes("gradeAscending")) {
        newFilteredCourses = Object.fromEntries(
          Object.entries(newFilteredCourses).sort((a, b) => {
            if (a[1].grade === null) return 1;
            if (b[1].grade === null) return -1;
            return a[1].grade - b[1].grade;
          })
        );
      } else if (filters.includes("gradeDescending")) {
        newFilteredCourses = Object.fromEntries(
          Object.entries(newFilteredCourses).sort((a, b) => {
            if (a[1].grade === null) return 1;
            if (b[1].grade === null) return -1;
            return b[1].grade - a[1].grade;
          })
        );
      }

      if (filters.includes("term")) {
        const groupedCourses: { [key: string]: { [key: string]: Course } } = {};
        Object.entries(newFilteredCourses).forEach(([courseKey, course]) => {
          const termName = formatTermName(course.term);
          if (!groupedCourses[termName]) groupedCourses[termName] = {};
          groupedCourses[termName][courseKey] = course;
        });
        setFilteredCourses(groupedCourses);
      } else if (filters.includes("subject")) {
        const groupedCourses: { [key: string]: { [key: string]: Course } } = {};
        Object.entries(newFilteredCourses).forEach(([courseKey, course]) => {
          const { subject } = course;
          if (!groupedCourses[subject]) groupedCourses[subject] = {};
          groupedCourses[subject][courseKey] = course;
        });
        setFilteredCourses(groupedCourses);
      } else {
        setFilteredCourses(newFilteredCourses);
      }
    },
    [terms]
  );

  return { filteredCourses, filterCourses };
};
