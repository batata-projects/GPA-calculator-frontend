import React from "react";
import { motion } from "framer-motion";
import { Course } from "../../../types/index.ts";
import { formatTermName, getLetterGrade } from "../../../utils/functions.ts";

interface CourseCardProps {
  course: Course;
  courseKey: string;
  isSelected: boolean;
  onClick: (courseId: string, course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  courseKey,
  isSelected,
  onClick,
}) => {
  return (
    <motion.div
      layout
      className={`flex items-center justify-between bg-white/10 rounded-lg p-3 transition duration-300 ease-in-out hover:bg-white/20 ${
        isSelected ? "ring-2 ring-yellow-400" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
          {course.subject.slice(0, 2)}
        </div>
        <div>
          <h4 className="font-semibold text-sm">
            {course.subject} {course.course_code}
          </h4>
          <p className="text-xs text-blue-200">
            {course.credits} credit{course.credits !== 1 ? "s" : ""} |{" "}
            {formatTermName(course.term)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onClick(courseKey, course)}
          className="bg-yellow-500 hover:bg-yellow-600 text-blue-800 p-1.5 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
          title="Edit course"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </button>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
            course.grade === null
              ? "bg-gray-400 text-gray-800"
              : "bg-white text-blue-800"
          }`}
          title={getLetterGrade(course.grade, course.graded)}
        >
          {getLetterGrade(course.grade, course.graded)}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
