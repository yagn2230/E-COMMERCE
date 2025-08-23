import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartItem = ({
  item,
  handleQuantityChange,
  removeFromCart,
  updating,
  isSelected,
  onCheckboxChange
}) => {
  const { _id, title, description, images, slug, price, stock } = item.productId;
  const quantity = item.quantity;

  return (
    <div className={`flex gap-4 p-4 rounded-lg shadow ${stock > 0 ? 'bg-white' : 'bg-gray-100 opacity-70'}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onCheckboxChange(item._id)}
        className="accent-[#0f2c59] mt-2"
      />
      <div className="flex gap-4 flex-1">
        <img
          src={images?.[0] || 'https://via.placeholder.com/96'}
          alt={title}
          className="w-20 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <Link to={`/products/${slug}`} className="font-medium text-[#0f2c59] hover:text-[#dac0a3]">
              {title}
            </Link>
            <button onClick={() => removeFromCart(_id)} className="text-red-500 hover:text-red-700">
              <FiTrash2 size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(_id, quantity - 1)}
                disabled={updating || quantity <= 1}
                className="text-[#0f2c59] hover:text-[#dac0a3] disabled:opacity-50"
              >
                <FiMinus size={14} />
              </button>
              <input
                type="number"
                min={1}
                max={stock}
                value={quantity}
                onChange={(e) => {
                  let val = parseInt(e.target.value) || 1;
                  if (val < 1) val = 1;
                  if (val > stock) val = stock;
                  handleQuantityChange(_id, val);
                }}
                disabled={updating}
                className="w-12 text-center border border-gray-300 rounded text-sm text-[#0f2c59]"
              />
              <button
                onClick={() => handleQuantityChange(_id, quantity + 1)}
                disabled={updating || quantity >= stock}
                className="text-[#0f2c59] hover:text-[#dac0a3] disabled:opacity-50"
              >
                <FiPlus size={14} />
              </button>
              <span className="ml-2 text-xs text-gray-500">In stock: {stock}</span>
            </div>
            <p className="font-medium text-[#0f2c59]">₹{(price?.amount * quantity).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
