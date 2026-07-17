declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLandmark: string;
  orderNote: string;
  cart: any[];
  onSuccess: () => void;
};

export async function payOnline({
  customerName,
  customerPhone,
  customerAddress,
  customerLandmark,
  orderNote,
  cart,
  onSuccess,
}: Props) {
  try {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Create Razorpay Order
    const res = await fetch("/api/create-razorpay-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: total,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create payment.");
    }

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency: order.currency,

      name: "MANNA KITCHEN",

      description: "Food Order",

      order_id: order.id,

      handler: async function (response: any) {
        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              customerName,
              customerPhone,
              customerAddress,
              customerLandmark,
              orderNote,
              cart,
            }),
          });

          const result = await verifyRes.json();

          if (!result.success) {
            alert("Payment verification failed.");
            return;
          }

          onSuccess();
        } catch (error) {
          console.error(error);
          alert("Payment verification failed.");
        }
      },

      prefill: {
        name: customerName,
        contact: customerPhone,
      },

      theme: {
        color: "#f97316",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
  } catch (err) {
    console.error(err);
    alert("Unable to start payment.");
  }
}
