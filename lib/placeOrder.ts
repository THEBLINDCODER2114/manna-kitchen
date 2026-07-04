import { supabase } from "./supabase";

type PlaceOrderData = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLandmark: string;
  latitude?: number | null;
  longitude?: number | null;
  orderNote: string;
  cart: any[];
};

export async function placeOrder(data: PlaceOrderData) {
  try {
    // Save Customer
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        full_name: data.customerName,
        phone: data.customerPhone,
        address: data.customerAddress,
        landmark: data.customerLandmark,
      })
      .select()
      .single();

    if (customerError) throw customerError;
    // Save Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        total: data.cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        status: "Pending",
        notes: data.orderNote,
      })
      .select()
      .single();

    if (orderError) throw orderError;
    const orderItems = data.cart.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
      bucket_type: item.bucketType ?? null,
      addons: item.addonsSelected ?? [],
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) throw orderItemsError;

    return {
  success: true,
};
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }
}
