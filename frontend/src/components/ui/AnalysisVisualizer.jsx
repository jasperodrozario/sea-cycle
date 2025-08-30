import React from "react";

const AnalysisVisualizer = ({ imageSrc, debrisData, imageLocation }) => {
  return (
    <div className="relative w-full">
      <img
        src={imageSrc}
        alt="Drone analysis"
        className="w-full h-auto rounded-md"
      />

      {imageLocation && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs p-2 rounded">
          <p>Lat: {imageLocation.latitude}</p>
          <p>Lon: {imageLocation.longitude}</p>
        </div>
      )}

      {/* Map over the debris data to create the boxes */}
      {debrisData.debris.map((item, index) => {
        const style = {
          left: `${item.box[0] * 100}%`,
          top: `${item.box[1] * 100}%`,
          width: `${(item.box[2] - item.box[0]) * 100}%`,
          height: `${(item.box[3] - item.box[1]) * 100}%`,
        };

        return (
          // The parent div is a "group" for the hover effect
          <div
            key={index}
            className="absolute group" // Use the 'group' class for hover
            style={style}
          >
            {/* The visible bounding box */}
            <div className="w-full h-full border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:bg-opacity-20 transition-all"></div>
            <span className="absolute bottom-full left-0 mb-1 bg-cyan-400 text-black text-xs font-bold p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.item}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AnalysisVisualizer;
