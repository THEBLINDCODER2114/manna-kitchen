import { NextResponse } from "next/server";
import crypto from "crypto";
import { createOrder } from "@/lib/createOrder";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      customerName,
      customerPhone,
      customerAddress,
      customerLandmark,
      orderNote,
      cart,
    } = await req.json();
    const { data: settings, error } = await supabaseAdmin
  .from("settings")
  .select("kitchen_open, closing_message")
  .eq("id", 1)
  .single();

if (error) {
  return NextResponse.json(
    {
      success: false,
      error: "Unable to check kitchen status.",
    },
    { status: 500 }
  );
}

if (!settings.kitchen_open) {
  return NextResponse.json(
    {
      success: false,
      error:
        settings.closing_message ||
        "Kitchen is currently closed.",
    },
    { status: 403 }
  );
}

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed",
        },
        {
          status: 400,
        },
      );
    }

    await createOrder({
      customerName,
      customerPhone,
      customerAddress,
      customerLandmark,
      orderNote,
      cart,

      paymentMethod: "ONLINE",
      paymentStatus: "Paid",

      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
      },
      {
        status: 500,
      },
    );
  }
}
