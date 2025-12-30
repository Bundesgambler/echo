
import React from 'react';

const NewsTicker: React.FC = () => {
  return (
    <div className="bg-red-600 text-white py-1 overflow-hidden whitespace-nowrap border-b border-red-700 select-none">
      <div className="inline-block animate-marquee">
        <span className="mx-4 font-bold tracking-tighter">+++ BREAKING NEWS +++</span>
        <span className="mx-4 font-bold tracking-tighter">VISUAL GENERATOR ACTIVE</span>
        <span className="mx-4 font-bold tracking-tighter">+++ EXCLUSIVE AI TECHNOLOGY +++</span>
        <span className="mx-4 font-bold tracking-tighter">REAL-TIME ASSET CREATION</span>
        <span className="mx-4 font-bold tracking-tighter">+++ NOUN-SOUP SYNTAX ENFORCED +++</span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
