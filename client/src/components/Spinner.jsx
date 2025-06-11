import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = ({ loading = true, size = 100, color = "#3b82f6" }) => {
  return (
    <div className="flex justify-center flex-col items-center h-full w-full">
      <ClipLoader loading={loading} size={size} color={color} />
      <p className='mt-2 font-semibold text-center'>Data Loading...</p>
    </div>
  );
};

export default Spinner;
