import React from 'react';

const EmptyCard = ({ imgSrc, message }: { imgSrc: string; message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Image */}
      <img src={imgSrc} alt="Empty State" className="w-40 h-40 mb-6" />

      {/* Message */}
      <h2 className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">{message}</h2>
    </div>
  );
};

export default EmptyCard;
