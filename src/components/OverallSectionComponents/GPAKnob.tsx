import React from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";

const GPAKnob = ({ value }) => {
  // this is done to prevent knob from getting bigger for values above 4
  let valueKnob = value;

  if (valueKnob === 4.3) {
    valueKnob = 4;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-80 h-96">
        <Flat
          progress={valueKnob}
          range={{ from: 0, to: 4 }}
          sign={{ value: "", position: "end" }}
          showValue={false}
          showMiniCircle={false}
          sx={{
            strokeColor: "#f97316",
            bgStrokeColor: "#0575E6",
            barWidth: 10,
            shape: "threequarters",
            textFamily: "Helvetica",
          }}
        />
        <div className="absolute bottom-[-20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-[37px] font-bold">GPA</div>
          <div className="mb-3 bg-orange-500 text-white px-7 py-1 rounded-3xl text-[40px]">
            {value.toFixed(1)}
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-[30px]">
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
