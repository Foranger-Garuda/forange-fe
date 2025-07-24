// components/Loading.tsx
import React from 'react';
import Image from 'next/image';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="animate-spin-slow">
        <Image
          src="/images/leaf.png"
          alt="Leaf"
          width={64}
          height={64}
        />
      </div>
      <p className="mt-4 text-green-700 font-semibold text-lg">Discovering…</p>
    </div>
  );
};

export default Loading;
