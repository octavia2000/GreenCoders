import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OrderSummary from "./OrderSummary";
import { paymentSchema } from "@/lib/auth/validations";

export default function PaymentForm() {
  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: "credit" },
  });

  const method = watch("method");

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 px-5">
      <OrderSummary subtotal="2426" discount="26" shipping="Free" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="flex items-center justify-between border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <input type="radio" value="paypal" {...register("method")} />
            <span>PayPal</span>
          </div>
          <img src="/paypal.svg" alt="PayPal" className="w-10 h-6" />
        </label>

        <label className="flex items-center justify-between border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <input type="radio" value="bank" {...register("method")} />
            <span>Bank Transfer</span>
          </div>
          <img src="/bank-icon.svg" alt="Bank" className="w-6 h-6" />
        </label>

        <label className="block border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="radio" value="credit" {...register("method")} />
              <span>Credit Card</span>
            </div>
            <img src="/bank-icon.svg" alt="Credit Card" className="w-6 h-6" />
          </div>

          {method === "credit" && (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                placeholder="1234 5678 8934 9998"
                {...register("cardNumber")}
                className="w-full border rounded-lg p-2"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  {...register("expiry")}
                  className="w-1/2 border rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  {...register("cvv")}
                  className="w-1/2 border rounded-lg p-2"
                />
              </div>
              <input
                type="text"
                placeholder="Name on card"
                {...register("nameOnCard")}
                className="w-full border rounded-lg p-2"
              />
            </div>
          )}
        </label>

        <label className="flex items-center justify-between border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <input type="radio" value="google" {...register("method")} />
            <span>Google Pay</span>
          </div>
          <img src="/bank-icon.svg" alt="Google Pay" className="w-6 h-6" />
        </label>

        <label className="flex items-center justify-between border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <input type="radio" value="cash" {...register("method")} />
            <span>Cash on Delivery</span>
          </div>
          <img
            src="/bank-icon.svg"
            alt="Cash on Delivery"
            className="w-6 h-6"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Checkout ($2400)
        </button>
      </form>
    </div>
  );
}
