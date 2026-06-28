"use client";

import { useEffect, useState } from "react";

type Props = {
  cart: any[];
  total: number;
  orderNote: string;
};

export default function Invoice({ cart, total, orderNote }: Props) {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-IN"));

    setCurrentTime(new Date().toLocaleTimeString("en-IN"));
  }, []);

  return (
    <div id="invoice" className="bg-white text-black p-8 w-[800px]">
      <div className="text-center border-b-4 border-orange-500 pb-6 mb-6">
        <img
          src="/mannakitchensticker.png"
          alt="Manna Kitchen"
          className="w-24 h-24 mx-auto mb-3"
        />

        <h1 className="text-6xl font-black tracking-wide">MANNA KITCHEN</h1>

        <p className="text-xl text-gray-600">Crafted For Cravings</p>

        <p className="text-sm text-gray-500 mt-2">Dombivli • Open Till 5 AM</p>
      </div>

      <hr className="mb-6" />

      <div className="grid grid-cols-2 gap-6 mb-8 text-lg">
        <div>
          <p>
            <strong>Order ID:</strong> MANNA-ORDER
          </p>

          <p>
            <strong>Type:</strong> Delivery
          </p>
        </div>

        <div className="text-right">
          <p>
            <strong>Date:</strong> {currentDate}
          </p>
          <p>
            <strong>Time:</strong> {currentTime}
          </p>
        </div>
      </div>

      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="bg-orange-500 text-white">
            <th className="p-4 text-left">Item</th>
            <th className="p-4 text-center">Qty</th>
            <th className="p-4 text-center">Amount</th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-4">
                <div className="font-bold text-lg">
                  {item.name}
                  {item.bucketType && ` (${item.bucketType})`}
                </div>

                {item.addonsSelected?.length > 0 && (
                  <div className="mt-2 text-sm">
                    {item.addonsSelected.map((addon: any, i: number) => (
                      <div key={i}>
                        + {addon.name} (₹{addon.price})
                      </div>
                    ))}
                  </div>
                )}
              </td>

              <td className="text-center font-semibold">{item.quantity}</td>

              <td className="text-center font-bold">
                ₹{item.price * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orderNote && (
        <div className="border rounded-xl p-4 mb-6">
          <h3 className="font-bold text-xl mb-2">Special Instructions</h3>

          <p>{orderNote}</p>
        </div>
      )}

      <div className="mt-6 bg-orange-50 border-2 border-orange-500 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-black">GRAND TOTAL</span>

          <span className="text-4xl font-black text-orange-600">₹{total}</span>
        </div>
      </div>
    </div>
  );
}
