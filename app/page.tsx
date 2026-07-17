"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MenuCard from "@/components/MenuCard";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import AddOnModal from "@/components/AddOnModal";
import Invoice from "@/components/Invoice";
import { toPng } from "html-to-image";
import { useKitchenStatus } from "@/hooks/useKitchenStatus";
import { toast } from "sonner";
import { getMenuItems } from "@/lib/menu";

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const { settings } = useKitchenStatus();
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const generateInvoice = async () => {
    const node = document.getElementById("invoice");

    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = "MannaKitchenInvoice.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Invoice generation failed:", error);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("manna-cart");
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("manna-cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function loadMenu() {
    const data = await getMenuItems();
    setMenuItems(data);
  }
  useEffect(() => {
    loadMenu();

    const channel = supabase
      .channel("customer-menu")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
        },
        (payload) => {
          console.log("Realtime menu event:", payload);
          loadMenu();
        },
      )
      .subscribe((status) => {
        console.log("Customer Realtime:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("manna-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: any) => {
    const existingItem = cart.find((cartItem) => {
      const sameAddons =
        JSON.stringify(
          [...(cartItem.addonsSelected || [])].map((a: any) => a.name).sort(),
        ) ===
        JSON.stringify(
          [...(item.addonsSelected || [])].map((a: any) => a.name).sort(),
        );

      return (
        cartItem.name === item.name &&
        cartItem.bucketType === item.bucketType &&
        sameAddons
      );
    });

    if (existingItem) {
      setCart(
        cart.map((cartItem) => {
          const sameAddons =
            JSON.stringify(
              [...(cartItem.addonsSelected || [])]
                .map((a: any) => a.name)
                .sort(),
            ) ===
            JSON.stringify(
              [...(item.addonsSelected || [])].map((a: any) => a.name).sort(),
            );

          return cartItem.name === item.name &&
            cartItem.bucketType === item.bucketType &&
            sameAddons
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem;
        }),
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          cartId: crypto.randomUUID(),
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (cartId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (cartId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const filterItems = (items: any[]) => {
    if (vegOnly) {
      return items.filter((item) => item.type === "veg");
    }

    if (nonVegOnly) {
      return items.filter((item) => item.type === "nonveg");
    }

    return items;
  };

  const burgers = filterItems(
    menuItems.filter((item) => item.category === "Burgers"),
  );

  const pizzas = filterItems(
    menuItems.filter((item) => item.category === "Pizza"),
  );

  const maggie = filterItems(
    menuItems.filter((item) => item.category === "Maggie"),
  );

  const pasta = filterItems(
    menuItems.filter((item) => item.category === "Pasta"),
  );

  const rolls = filterItems(
    menuItems.filter((item) => item.category === "Rolls"),
  );

  const sides = filterItems(
    menuItems.filter((item) => item.category === "Sides"),
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <main className="bg-black text-white pt-24">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        cartOpen={cartOpen}
        vegOnly={vegOnly}
        nonVegOnly={nonVegOnly}
        setVegOnly={setVegOnly}
        setNonVegOnly={setNonVegOnly}
      />

      {settings && !settings.kitchen_open && (
        <div className="bg-red-600 text-white py-4 px-6 text-center shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold">
              🔴 We're Currently Closed
            </h2>

            <p className="mt-2 text-sm md:text-base">
              {settings.closing_message || "We'll be back soon!"}
            </p>
          </div>
        </div>
      )}

      <Hero />

      {/* BURGERS */}
      <section id="burgers" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
          BURGERS
        </h2>

        <div
          className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-6"
        >
          {filterItems(burgers).map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* PIZZAS */}
      <section id="pizzas" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
          PIZZAS
        </h2>

        <div
          className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-6"
        >
          {filterItems(pizzas).map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* MAGGIE */}
      <section id="maggie" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
          MAGGIE
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filterItems(maggie).map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* PASTA */}
      <section id="pasta" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
          PASTA
        </h2>

        <div
          className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-6"
        >
          {filterItems(pasta).map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* ROLLS */}
      <section id="rolls" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
          ROLLS
        </h2>

        <div
          className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6"
        >
          {filterItems(rolls).map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* SIDES */}
      <section id="sides" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
          SIDES
        </h2>

        <div
          className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-6"
        >
          {filterItems(sides).map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <Footer />

      <button
        ref={menuButtonRef}
        onClick={() => setMenuOpen(!menuOpen)}
        className="
  fixed
  bottom-24
md:bottom-6
right-4
md:right-6
  z-50
  bg-orange-500
  hover:bg-orange-600
  px-6
  py-4
  rounded-full
  shadow-xl
  font-bold
  "
      >
        ☰ Menu
      </button>
      {menuOpen && (
        <div
          ref={menuRef}
          className="
fixed
bottom-24
right-6
z-50
bg-zinc-900
border
border-orange-500
rounded-2xl
p-5
w-52
flex
flex-col
gap-4
shadow-xl
"
        >
          <a href="#burgers" onClick={() => setMenuOpen(false)}>
            🍔 BURGERS
          </a>

          <a href="#pizzas" onClick={() => setMenuOpen(false)}>
            🍕 PIZZA
          </a>

          <a href="#maggie" onClick={() => setMenuOpen(false)}>
            🍜 MAGGIE
          </a>

          <a href="#pasta" onClick={() => setMenuOpen(false)}>
            🍝 PASTA
          </a>

          <a href="#rolls" onClick={() => setMenuOpen(false)}>
            🌯 ROLLS
          </a>

          <a href="#sides" onClick={() => setMenuOpen(false)}>
            🍟 SIDES
          </a>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
        }}
      >
        <Invoice
          cart={cart}
          total={cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          )}
          orderNote={orderNote}
        />
      </div>

      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[998]"
          onClick={() => setCartOpen(false)}
        />
      )}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        clearCart={clearCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        orderNote={orderNote}
        setOrderNote={setOrderNote}
        generateInvoice={generateInvoice}
        openCheckout={() => {
          if (settings && !settings.kitchen_open) {
            toast.error(
              settings?.closing_message || "Kitchen is currently closed.",
            );
            return;
          }

          setCheckoutOpen(true);
        }}
        closeCart={() => setCartOpen(false)}
      />

      <CheckoutModal
        isOpen={checkoutOpen && (settings?.kitchen_open ?? true)}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        orderNote={orderNote}
        onOrderPlaced={() => {
          clearCart();
          setCheckoutOpen(false);
        }}
      />
    </main>
  );
}
