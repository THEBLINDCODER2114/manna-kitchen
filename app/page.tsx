"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MenuCard from "@/components/MenuCard";
import CartDrawer from "@/components/CartDrawer";
import AddOnModal from "@/components/AddOnModal";
import Invoice from "@/components/Invoice";
import { toPng } from "html-to-image";

import { burgers, pizzas, maggie, pasta, rolls, sides } from "@/data/menu";
import { getMenuItems } from "@/lib/menu";

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [loading, setLoading] = useState(true);

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
  async function test() {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*");

    console.log(data);
    console.log(error);
  }

  test();
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
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (name: string, bucketType?: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.name === name && item.bucketType === bucketType
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (name: string, bucketType?: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === name && item.bucketType === bucketType
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (name: string, bucketType?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.name === name && item.bucketType === bucketType),
      ),
    );
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
          {filterItems(burgers).map((item, index) => (
            <MenuCard
              key={index}
              item={item}
              onAdd={() => {
                setSelectedItem(item);
                setAddonModalOpen(true);
              }}
            />
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
          {filterItems(pizzas).map((item, index) => (
            <MenuCard
              key={index}
              item={item}
              onAdd={() => {
                setSelectedItem(item);
                setAddonModalOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      {/* MAGGIE */}
      <section id="maggie" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
          MAGGIE
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filterItems(maggie).map((item, index) => (
            <MenuCard
              key={index}
              item={item}
              onAdd={() => {
                setSelectedItem(item);
                setAddonModalOpen(true);
              }}
            />
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
          {filterItems(pasta).map((item, index) => (
            <MenuCard
              key={index}
              item={item}
              onAdd={() => {
                setSelectedItem(item);
                setAddonModalOpen(true);
              }}
            />
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
          {filterItems(rolls).map((item, index) => (
            <MenuCard
              key={index}
              item={item}
              onAdd={() => {
                setSelectedItem(item);
                setAddonModalOpen(true);
              }}
            />
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
          {filterItems(sides).map((item, index) => (
            <MenuCard
              key={index}
              item={item}
              onAdd={() => {
                setSelectedItem(item);
                setAddonModalOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      <Footer />

      <button
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

      <AddOnModal
        item={selectedItem}
        isOpen={addonModalOpen}
        onClose={() => setAddonModalOpen(false)}
        onConfirm={(item) => addToCart(item)}
      />

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
      />
    </main>
  );
}
