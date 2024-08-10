import React from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";

const GPAKnob = ({ value }) => {
  // this is done to prevent knob from getting bigger for values above 4
  let valueKnob = value;

  if (valueKnob === 4.3) {
    valueKnob = 4;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center font-[inter]">
      <div className="relative w-64 h-80 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105">
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
            {(Math.floor(value * 100) / 100).toFixed(2)}
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
      </div>
    </div>
  );
};

export default GPAKnob;
