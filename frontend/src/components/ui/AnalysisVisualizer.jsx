import React from "react";

const AnalysisVisualizer = ({ imageSrc, debrisData }) => {
  return (
    <div className="relative w-full">
      <img src={imageSrc} alt="Drone analysis" className="w-full h-auto" />
      {debrisData.debris.map((item, index) => {
        const style = {
          left: `${item.box[0] * 100}%`,
          top: `${item.box[1] * 100}%`,
          width: `${(item.box[2] - item.box[0]) * 100}%`,
          height: `${(item.box[3] - item.box[1]) * 100}%`,
        };
        return (
          <div
            key={index}
            className="absolute border-2 border-cyan-400"
            style={style}
          >
            <span className="absolute -top-6 left-0 bg-cyan-400 text-black text-xs p-1 rounded">
              {item.item}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AnalysisVisualizer;
