import React, { useState, useEffect } from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";
import { useSpring, animated, config } from "react-spring";
import Confetti from "react-confetti";

interface GPAKnobProps {
  value: number;
}

const GPAKnob: React.FC<GPAKnobProps> = ({ value }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [comment, setComment] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Animation for the GPA value
  const animatedProps = useSpring({
    number: value,
    from: { number: 0 },
    config: { duration: 1000 },
  });

  // Animation for the comment
  const [{ textLength }, setTextLength] = useSpring(() => ({ textLength: 0 }));

  // This is done to prevent knob from getting bigger for values above 4
  const valueKnob = Math.min(value, 4);

  useEffect(() => {
    if (value > 3.6) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  useEffect(() => {
    // Set comment based on GPA range
    let newComment = "";
    if (value >= 4.0) {
      newComment =
        "Congratulations! Your GPA is in the top 1% of university students.";
    } else if (value >= 3.7) {
      newComment = "Excellent work! You're performing at a very high level.";
    } else if (value >= 3.3) {
      newComment = "Great job! You're well above average.";
    } else if (value >= 3.0) {
      newComment = "Good work! You're performing above average.";
    } else if (value >= 2.7) {
      newComment = "You're doing well. Keep up the good work!";
    } else if (value >= 2.3) {
      newComment = "You're on the right track. Keep pushing yourself!";
    } else if (value >= 2.0) {
      newComment = "You're meeting the basic requirements. Aim higher!";
    } else {
      newComment = "There's room for improvement. Seek help if needed!";
    }
    setComment(newComment);

    // Animate the text length
    setTextLength({ textLength: newComment.length, config: config.molasses });
  }, [value, setTextLength]);

  const scaleProps = useSpring({
    transform: isHovered
      ? "scale(1.05)"
      : value > 4
      ? "scale(1.1)"
      : "scale(1)",
    config: { tension: 300, friction: 10 },
  });

  // Function to format the GPA value
  const formatGPA = (gpa: number) => {
    return (Math.floor(gpa * 100) / 100).toFixed(2);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center font-[inter]">
      <animated.div
        style={scaleProps}
        className="relative w-64 h-80 focus:outline-none transition duration-300 ease-in-out cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Flat
          progress={valueKnob}
          range={{ from: 0, to: 4 }}
          sign={{ value: "", position: "end" }}
          showValue={false}
          showMiniCircle={false}
          sx={{
            strokeColor: "#f97316", // Change color on hover
            bgStrokeColor: "#0575E6", // Change background color on hover
            barWidth: 8,
            shape: "threequarters",
          }}
        />
        <div className="absolute bottom-[-18%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-3xl font-bold mb-2">GPA</h2>
          <div
            className={`mb-2 bg-orange-500 text-white px-5 py-1 rounded-3xl text-3xl transition-colors duration-300`}
          >
            <animated.span>
              {animatedProps.number.to((n) => formatGPA(n))}
            </animated.span>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-2xl">
          <div className="absolute bottom-[22%] right-[3%] transform -translate-x-1/2">
            4
          </div>
          <div className="absolute top-[23%] right-[-4%] transform -translate-y-1/2">
            3
          </div>
          <div className="absolute bottom-[22%] left-[7%] transform -translate-x-1/2">
            0
          </div>
          <div className="absolute top-[23%] left-[-3%] transform -translate-y-1/2">
            1
          </div>
          <div className="absolute top-[-5%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            2
          </div>
        </div>
      </animated.div>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}
      <div className="mt-[5%] text-center max-w-md h-6">
        <animated.p className="text-lg font-semibold text-gray-700">
          {textLength.to((len) => comment.slice(0, Math.floor(len)))}
        </animated.p>
      </div>
    </div>
  );
};

export default GPAKnob;
