import React from "react";

/**
 * Crop result background: gradient at the back, cloud image in front, both behind content.
 */
const CropResultBackground: React.FC = () => {
  return (
    <>
      {/* Gradient background (farthest back) */}
      <div
        className="absolute left-0 top-0 w-full h-[100vh] min-h-[300px] z-[-20]"
        style={{
          background: 'linear-gradient(to bottom, #bde0fe 0%, #ffffff 100%)',
        }}
      />
      {/* Cloud image (in front of gradient, behind content) */}
      <div
        className="absolute left-0 top-0 w-full h-[100vh] min-h-[300px] z-[-10]"
        style={{
          backgroundImage: 'url(/cloud.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </>
  );
};

export default CropResultBackground; 