// components/Loading.tsx
import React from "react";
import Image from "next/image";

const Loading: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white/50 backdrop-blur-md flex items-center justify-center flex-col">
      <div className="animate-spin opacity-100">
        <Image src="/leaf.png" alt="Leaf" width={256} height={256} />
      </div>
      <p className=" text-green-700 font-semibold text-2xl text-center">Discovering…</p>
    </div>
  );
};

export default Loading;

