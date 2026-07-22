import { supabaseAdmin } from "@/lib/supabaseAdmin";

type CreateOrderProps = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLandmark: string;
  orderNote: string;
  cart: any[];

  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "Pending" | "Paid";

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
};

export async function createOrder({
  customerName,
  customerPhone,
  customerAddress,
  customerLandmark,
  orderNote,
  cart,

  paymentMethod,
  paymentStatus,

  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: CreateOrderProps) {
  // -------------------------
  // Create Customer
  // -------------------------

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

  if (customerError) throw customerError;

  // -------------------------
  // Get latest menu prices
  // -------------------------

  const ids = cart.map((item) => item.id);

  const { data: menuItems, error: menuError } = await supabaseAdmin
    .from("menu_items")
    .select("id,price")
    .in("id", ids);

  if (menuError) throw menuError;

  let total = 0;

  const orderItems = cart.map((item) => {
    const menu = menuItems!.find((m) => m.id === item.id);

    if (!menu) {
      throw new Error(`Menu item ${item.id} not found`);
    }

    const addonsTotal = (item.addonsSelected ?? []).reduce(
      (sum: number, addon: any) => sum + Number(addon.price),
      0,
    );

    const itemPrice = Number(menu.price) + addonsTotal;

    total += itemPrice * item.quantity;

    return {
      menu_item_id: item.id,
      quantity: item.quantity,
      price: itemPrice,
      bucket_type: item.bucketType ?? null,
      addons: item.addonsSelected ?? [],
    };
  });

  // -------------------------
  // Create Order
  // -------------------------

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_id: customer.id,

      total,

      status: "Pending",

      notes: orderNote,

      payment_method: paymentMethod,

      payment_status: paymentStatus,

      razorpay_order_id: razorpayOrderId,

      razorpay_payment_id: razorpayPaymentId,

      razorpay_signature: razorpaySignature,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // -------------------------
  // Create Order Items
  // -------------------------

  const finalItems = orderItems.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: orderItemsError } = await supabaseAdmin
    .from("order_items")
    .insert(finalItems);

  if (orderItemsError) throw orderItemsError;

  return order;
}
