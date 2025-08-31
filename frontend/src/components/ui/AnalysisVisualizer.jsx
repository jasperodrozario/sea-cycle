import React, { useState } from "react";
import MaximizeIcon from "./MaximizeIcon";

const AnalysisVisualizer = ({ imageSrc, debrisData, imageLocation }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const renderVisualizerContent = () => (
    <div className="relative">
      <img
        src={imageSrc}
        alt="Drone analysis"
        className="w-full h-auto rounded-md"
      />
      {imageLocation && (
        <div className="absolute top-2 left-2 text-white text-xs p-2 rounded-lg backdrop-blur-xs bg-white/10 border border-white/10 shadow-lg">
          <p className="font-extrabold">Lat: {imageLocation.latitude}</p>
          <p className="font-extrabold">Lon: {imageLocation.longitude}</p>
        </div>
      )}
      {debrisData.map((item, index) => {
        const style = {
          left: `${item.box[0] * 100}%`,
          top: `${item.box[1] * 100}%`,
          width: `${(item.box[2] - item.box[0]) * 100}%`,
          height: `${(item.box[3] - item.box[1]) * 100}%`,
        };
        return (
          <div key={index} className="absolute group" style={style}>
            <div className="w-full h-full border-2 border-green-400 group-hover:bg-green-400/30 transition-all"></div>
            <span className="absolute bottom-full left-0 mb-1 bg-cyan-400 text-black text-xs font-bold p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.item}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="relative">
        <div className="relative w-full max-h-96 overflow-y-auto">
          {renderVisualizerContent()}
        </div>
        <button
          onClick={openModal}
          className="absolute top-2 right-2 bg-slate-800/60 text-white px-3 py-1 rounded-lg text-sm hover:bg-cyan-600 transition-colors flex items-center gap-2"
        >
          Full View
          <MaximizeIcon className="w-4 h-4" />
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-auto max-h-[calc(90vh-2rem)]">
              {renderVisualizerContent()}
            </div>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AnalysisVisualizer;
