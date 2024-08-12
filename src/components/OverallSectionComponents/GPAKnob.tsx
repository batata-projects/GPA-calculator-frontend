import React, { useState, useEffect } from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";
import { useSpring, animated } from "react-spring";
import Confetti from "react-confetti";

interface GPAKnobProps {
  value: number;
}

const GPAKnob: React.FC<GPAKnobProps> = ({ value }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Animation for the GPA value
  const animatedProps = useSpring({
    number: value,
    from: { number: 0 },
    config: { duration: 1000 }, // Set a fixed duration for the animation
  });

  // This is done to prevent knob from getting bigger for values above 4
  const valueKnob = Math.min(value, 4);

  useEffect(() => {
    if (value > 4) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const scaleProps = useSpring({
    transform: value > 4 ? "scale(1.1)" : "scale(1)",
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
        className="relative w-64 h-80 focus:outline-none transition duration-300 ease-in-out"
      >
        <Flat
          progress={valueKnob}
          range={{ from: 0, to: 4 }}
          sign={{ value: "", position: "end" }}
          showValue={false}
          showMiniCircle={false}
          sx={{
            strokeColor: "#f97316",
            bgStrokeColor: "#0575E6",
            barWidth: 8,
            shape: "threequarters",
          }}
        />
        <div className="absolute bottom-[-18%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-3xl font-bold mb-2">GPA</h2>
          <div className="mb-2 bg-orange-500 text-white px-5 py-1 rounded-3xl text-3xl">
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
    </div>
  );
};

export default GPAKnob;
