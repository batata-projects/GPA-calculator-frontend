import React from "react";
import { motion } from "framer-motion";
import { Course, FilteredCourses } from "../../types";
import CourseCard from "./CourseCard.tsx";

interface CourseListProps {
  filteredCourses: FilteredCourses;
  selectedCourseId: string | null;
  onCourseClick: (courseId: string, course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({
  filteredCourses,
  selectedCourseId,
  onCourseClick,
}) => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const courseVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.5 },
        scale: { duration: 0.3, ease: "easeOut" },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        opacity: { duration: 0.3 },
        scale: { duration: 0.2 },
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Object.entries(filteredCourses).map(([key, value]) => {
        if (typeof value === "object" && "subject" in value) {
          const course = value as Course;
          return (
            <motion.div key={key} variants={courseVariants}>
              <CourseCard
                course={course}
                courseKey={key}
                isSelected={selectedCourseId === key}
                onClick={onCourseClick}
              />
            </motion.div>
          );
        } else {
          // This is a group (term or subject)
          return (
            <motion.div
              key={key}
              variants={courseVariants}
              className="col-span-full"
            >
              <h4 className="text-xl font-semibold mb-2">{key}</h4>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={containerVariants}
              >
                {Object.entries(value as { [key: string]: Course }).map(
                  ([courseKey, course]) => (
                    <motion.div key={courseKey} variants={courseVariants}>
                      <CourseCard
                        course={course}
                        courseKey={courseKey}
                        isSelected={selectedCourseId === courseKey}
                        onClick={onCourseClick}
                      />
                    </motion.div>
                  )
                )}
              </motion.div>
            </motion.div>
          );
        }
      })}
    </motion.div>
  );
};

export default CourseList;
