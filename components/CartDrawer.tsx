"use client";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  clearCart: () => void;
  increaseQuantity: (name: string) => void;
  decreaseQuantity: (name: string) => void;
  removeFromCart: (name: string) => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
  generateInvoice: () => void;
};

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  orderNote,
  setOrderNote,
  generateInvoice,
}: Props) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const whatsappMessage = encodeURIComponent(
    `MANNA KITCHEN ORDER

${cart
  .map(
    (item, index) => `${index + 1}. ${item.name}
Qty: ${item.quantity}
${
  item.addonsSelected?.length
    ? item.addonsSelected
        .map((addon: any) => `- ${addon.name} (+₹${addon.price})`)
        .join("\n")
    : ""
}
Subtotal: ₹${item.price * item.quantity}`,
  )
  .join("\n\n--------------------\n\n")}

--------------------
TOTAL: ₹${total}
--------------------
SPECIAL INSTRUCTIONS:
${orderNote || "None"}

Name:
Phone:
Address:`,
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-zinc-900 border-l border-orange-500 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-orange-500">Your Cart</h2>

          <button
            onClick={onClose}
            className="
  px-3
  py-1
  rounded-lg
  bg-zinc-800
  hover:bg-zinc-700
  "
          >
            ✕ Close
          </button>
        </div>

        <div
          className="
  mt-6
  space-y-4
  flex-1
  overflow-y-auto
  pr-2
  scrollbar-thin
  scrollbar-thumb-orange-500
  "
        >
          {cart.length === 0 && <p className="text-gray-400">Cart is empty</p>}

          {cart.map((item, index) => (
            <div key={index} className="border-b border-zinc-700 pb-3">
              <p className="font-semibold">{item.name}</p>
              {item.addonsSelected?.length > 0 && (
                <div className="mt-1 mb-2">
                  {item.addonsSelected.map((addon: any, index: number) => (
                    <p key={index} className="text-sm text-gray-400">
                      • {addon.name}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => decreaseQuantity(item.name)}
                  className="
w-10
h-10
bg-red-500
rounded-lg
font-bold
text-lg
"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQuantity(item.name)}
                  className="
w-10
h-10
bg-green-500
rounded-lg
font-bold
text-lg
"
                >
                  +
                </button>
              </div>

              <p className="text-orange-400">₹{item.price * item.quantity}</p>

              <button
                onClick={() => removeFromCart(item.name)}
                className="mt-2 text-red-500 hover:text-red-400 text-sm font-semibold"
              >
                🗑 Remove Item
              </button>
            </div>
          ))}
        </div>

        <div
          className="
  mt-4
  border-t
  border-zinc-700
  pt-4
  bg-zinc-900
  sticky
  bottom-0
  "
        >
          <div className="mb-1">
            <label className="block mb-2 font-semibold text-orange-400">
              Special Instructions
            </label>

            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="NOTES..."
              className="
      w-full
      bg-zinc-800
      border
      border-zinc-700
      rounded-xl
      p-3
      text-white
      resize-none
      h-20
    "
            />
          </div>
          <h3
            className="
  text-2xl
  font-black
  text-orange-500
  mb-3
  "
          >
            Total: ₹{total}
          </h3>

          <button
            onClick={generateInvoice}
            className="w-full bg-orange-500 py-3 rounded-xl font-bold mb-3"
          >
            📄 Download Bill
          </button>

          <a
            href={`https://wa.me/917045202965?text=${whatsappMessage}`}
            target="_blank"
            className="block text-center bg-green-500 py-3 rounded-xl font-bold"
          >
             Place Order
          </a>

          <button
            onClick={clearCart}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold mt-3"
          >
            Empty Cart
          </button>
        </div>
      </div>
    </div>
  );
}
