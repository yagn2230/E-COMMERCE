// CartItemsList.js
import React from 'react';
import CartItem from './CartItem';

const CartItemsList = ({
  cart,
  handleQuantityChange,
  removeFromCart,
  updatingItems,
  showClearCartConfirm,
  setShowClearCartConfirm,
  handleClearCart,
  selectedItems,
  handleCheckboxChange
}) => {
  return (
    <div className="flex-1 space-y-4">
      {cart.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          handleQuantityChange={handleQuantityChange}
          removeFromCart={removeFromCart}
          updating={updatingItems[item.productId._id]}
          isSelected={selectedItems.includes(item._id)}
          onCheckboxChange={() => handleCheckboxChange(item._id)}
        />
      ))}
    </div>
  );
};

export default CartItemsList;
