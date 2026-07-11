import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerAddress,
      customerLandmark,
      orderNote,
      cart,
    } = body;

    // Insert Customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .insert({
        full_name: customerName,
        phone: customerPhone,
        address: customerAddress,
        landmark: customerLandmark,
      })
      .select()
      .single();

    if (customerError) {
      console.error(customerError);
      return NextResponse.json(
        { success: false, error: customerError.message },
        { status: 500 }
      );
    }

    // Insert Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: customer.id,
        total: cart.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        ),
        status: "Pending",
        notes: orderNote,
      })
      .select()
      .single();

    if (orderError) {
      console.error(orderError);
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      );
    }

    // Insert Order Items
    const orderItems = cart.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
      bucket_type: item.bucketType ?? null,
      addons: item.addonsSelected ?? [],
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      console.error(orderItemsError);
      return NextResponse.json(
        { success: false, error: orderItemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}