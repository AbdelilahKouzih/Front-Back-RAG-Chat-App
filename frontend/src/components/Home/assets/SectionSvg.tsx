import React from 'react';

interface SectionSvgProps {
  crossesOffset?: boolean; // Indique que crossesOffset est facultatif
}

const SectionSvg: React.FC<SectionSvgProps> = ({ crossesOffset }) => {
  // Vérifie si crossesOffset est défini avant de l'utiliser
  const offset = crossesOffset ? crossesOffset : false;

  return (
    <svg
      className="overflow-visible"
      width="20"
      height="12"
      viewBox="0 0 20 12"
    >
      <rect
        className="transition-all origin-center"
        y={offset ? "5" : "0"}
        width="20"
        height="2"
        rx="1"
        fill="white"
        transform={`rotate(${offset ? "45" : "0"})`}
      />
      <rect
        className="transition-all origin-center"
        y={offset ? "5" : "10"}
        width="20"
        height="2"
        rx="1"
        fill="white"
        transform={`rotate(${offset ? "-45" : "0"})`}
      />
    </svg>
  );
};

export default SectionSvg;
