import React, { useState } from 'react';

const EmptyCartMessage = () => (
  <div className="text-center py-8 sm:py-16 bg-white rounded-lg shadow">
    <p className="text-lg sm:text-xl font-medium text-[#0f2c59] mb-3 sm:mb-4">
      Your cart is empty
    </p>
    <a
      href="/shop"
      className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 bg-[#0f2c59] text-white rounded-lg hover:bg-[#dac0a3] hover:text-[#0f2c59] transition text-sm sm:text-base"
    >
      Browse Products
    </a>
  </div>
);

export default EmptyCartMessage;
