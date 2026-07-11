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
    const response = await fetch("/api/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      return {
        success: false,
        error: result.error,
      };
    }

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