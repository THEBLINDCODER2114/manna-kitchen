"use client";

import { useState } from "react";
import { placeOrder } from "@/lib/placeOrder";
import { payOnline } from "@/lib/payOnline";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  orderNote: string;
  onOrderPlaced: () => void;
};

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  orderNote,
  onOrderPlaced,
}: Props) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerLandmark, setCustomerLandmark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Please fill all required fields.");
      return;
    }

    // CASH ON DELIVERY
    if (paymentMethod === "COD") {
      const result = await placeOrder({
        customerName,
        customerPhone,
        customerAddress,
        customerLandmark,
        orderNote,
        cart,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to place order");
        setIsSubmitting(false);
        return;
      }

      toast.success("🎉 Order Placed Successfully!");

      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerLandmark("");
      setIsSubmitting(false);
      onOrderPlaced();
      onClose();

      return;
    }

    // ONLINE PAYMENT
    try {
      await payOnline({
        customerName,
        customerPhone,
        customerAddress,
        customerLandmark,
        orderNote,
        cart,

        onSuccess: () => {
          toast.success("🎉 Payment Successful!");

          setCustomerName("");
          setCustomerPhone("");
          setCustomerAddress("");
          setCustomerLandmark("");

          setIsSubmitting(false);

          onOrderPlaced();
          onClose();
        },
      });
    } catch {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-5">
      <div
        className="
    bg-zinc-900
    rounded-3xl
    w-full
    max-w-xl
    max-h-[90vh]
    overflow-y-auto
    p-8
    border
    border-orange-500
  "
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-orange-500">Checkout</h2>

          <button onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-orange-400">
              👤 Full Name
            </label>

            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-zinc-800 rounded-xl p-4 border border-zinc-700"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-orange-400">
              📞 Phone Number
            </label>

            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-zinc-800 rounded-xl p-4 border border-zinc-700"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-orange-400">
              🏠 Flat / Landmark
            </label>

            <input
              value={customerLandmark}
              onChange={(e) => setCustomerLandmark(e.target.value)}
              className="w-full bg-zinc-800 rounded-xl p-4 border border-zinc-700"
              placeholder="Flat no., Landmark..."
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-orange-400">
              📍 Delivery Address
            </label>

            <textarea
              rows={3}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full bg-zinc-800 rounded-xl p-4 border border-zinc-700"
              placeholder="Enter delivery address"
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-orange-400 mb-4">
            💳 Payment Method
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 bg-zinc-800 p-4 rounded-xl cursor-pointer border border-zinc-700">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />

              <div>
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-sm text-gray-400">
                  Pay when your order arrives.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 bg-zinc-800 p-4 rounded-xl cursor-pointer border border-zinc-700">
              <input
                type="radio"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />

              <div>
                <p className="font-semibold">Pay Online</p>
                <p className="text-sm text-gray-400">
                  UPI • Cards • Net Banking
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-bold text-orange-400 mb-5">
            🛒 Order Summary
          </h3>

          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-zinc-700 pb-3"
              >
                <div>
                  <p className="font-semibold">
                    {item.quantity} × {item.name}
                  </p>

                  {item.bucketType && (
                    <p className="text-sm text-gray-400">{item.bucketType}</p>
                  )}

                  {item.addonsSelected?.length > 0 && (
                    <div className="mt-1">
                      {item.addonsSelected.map((addon: any, i: number) => (
                        <p key={i} className="text-xs text-gray-500">
                          + {addon.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="font-bold text-orange-400">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center border-t border-zinc-700 pt-5">
          <span className="text-2xl font-bold">Total</span>

          <span className="text-3xl font-black text-orange-500">₹{total}</span>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            disabled={isSubmitting}
            onClick={() => {
              setCustomerName("");
              setCustomerPhone("");
              setCustomerAddress("");
              setCustomerLandmark("");

              onClose();
            }}
            className="flex-1 bg-zinc-700 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? paymentMethod === "COD"
                ? "⏳ Placing Order..."
                : "⏳ Preparing Payment..."
              : paymentMethod === "COD"
                ? "Place Order"
                : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
