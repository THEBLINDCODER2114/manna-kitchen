import { NextResponse } from "next/server";
import { createOrder } from "@/lib/createOrder";
import { supabaseAdmin } from "@/lib/supabaseAdmin";


export async function POST(req: Request) {
  try {
    const body = await req.json();
const { data: settings, error } = await supabaseAdmin
  .from("settings")
  .select("kitchen_open, closing_message")
  .eq("id", 1)
  .single();

if (error) {
  return Response.json(
    { error: "Unable to check kitchen status." },
    { status: 500 }
  );
}

if (!settings.kitchen_open) {
  return Response.json(
    {
      error:
        settings.closing_message ||
        "Kitchen is currently closed.",
    },
    { status: 403 }
  );
}

    await createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      customerLandmark: body.customerLandmark,
      orderNote: body.orderNote,
      cart: body.cart,

      paymentMethod: body.paymentMethod ?? "COD",
      paymentStatus: body.paymentStatus ?? "Pending",

      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}