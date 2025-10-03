import React, { useState } from "react";
import { productsData } from "../../components/data/product";
import OrderSummary from "./OrderSummary";

const Cart = () => {
  const [cartItems, setCartItems] = useState(productsData);
  const screenWidth = window.innerWidth;

  const handleQuantity = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "increase"
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = 26;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen p-6 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 md:max-w-[37rem] md:mx-auto">
        <h1 className="text-xl font-semibold mb-10">My Cart</h1>
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />
                <div className="mr-4">
                  <h2 className="font-medium">
                    {screenWidth < 400
                      ? item.name.slice(0, 15) + "..."
                      : item.name}
                  </h2>
                  <p className="text-gray-500 text-sm">#{item.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:mr-[2rem]">
                <div className="flex items-center border rounded-lg px-2">
                  <button
                    onClick={() => handleQuantity(item.id, "decrease")}
                    className="px-2"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item.id, "increase")}
                    className="px-2"
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold">
                  ${item.price * item.quantity}
                </span>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <OrderSummary subtotal={subtotal} discount={discount} total={total} />
    </div>
  );
};

export default Cart;
