export function getWhatsappMessage(order: any, status: string) {
  const customer = order.customers?.full_name ?? "Customer";

  switch (status) {
    case "Accepted":
      return `🍔 *MANNA KITCHEN*

Hi ${customer},

Your Order #${order.id} has been *Accepted* ✅

We'll start preparing it shortly.

Thank you ❤️`;

    case "Preparing":
      return `🍳 *MANNA KITCHEN*

Hi ${customer},

Your Order #${order.id} is now being *Prepared*.

We'll notify you once it's out for delivery.

Thank you ❤️`;

    case "Out For Delivery":
      return `🛵 *MANNA KITCHEN*

Hi ${customer},

Your Order #${order.id} is *Out For Delivery* 🚚

It will arrive soon.

Thank you ❤️`;

    case "Delivered":
      return `Hello ${customer}, Your order #${order.id} has been Delivered. Thank you for ordering from MANNA KITCHEN.`;

    default:
      return "";

    case "Rejected":
      return `😔 *MANNA KITCHEN*

Hi ${customer},

We sincerely apologize.

Unfortunately, we are unable to accept your Order #${order.id} at the moment due to operational reasons.

We truly regret the inconvenience caused.

🙏 We hope you'll give us another opportunity to serve you soon.

Thank you for understanding.

❤️ Team MANNA KITCHEN`;
  }
}
