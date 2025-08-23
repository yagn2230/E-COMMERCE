import React from 'react';

const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const StatusStepper = ({ currentStatus }) => {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between gap-4">
      {steps.map((step, index) => (
        <div key={step} className="flex-1 text-center">
          <div className={`w-4 h-4 mx-auto rounded-full mb-1 ${
            index <= currentIndex ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <p className={`text-sm ${index <= currentIndex ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>{step}</p>
        </div>
      ))}
    </div>
  );
};

export default StatusStepper;