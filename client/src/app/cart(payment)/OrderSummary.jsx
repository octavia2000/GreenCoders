import React from "react";
import { Link } from "react-router-dom";

export default function OrderSummary({ subtotal, discount, total, shipping }) {
  return (
    <div className="w-full md:w-[40rem] lg:w-80 p-4 border rounded-lg h-fit mx-auto">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="flex justify-between mb-2">
        <span>Total</span>
        <span>${subtotal}</span>
      </div>

      <div className="flex justify-between mb-2 text-green-600">
        <span>Discount</span>
        <span>-${discount}</span>
      </div>

      {shipping && (
        <div className="flex justify-between mb-4">
          <span>Shipping</span>
          <span>{shipping}</span>
        </div>
      )}

      <Link
        to="/payment"
        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold block text-center"
      >
        Checkout (${total})
      </Link>
    </div>
  );
}
