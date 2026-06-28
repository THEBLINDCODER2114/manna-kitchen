import { FaWhatsapp, FaInstagram, FaShoppingCart } from "react-icons/fa";

type Props = {
  cartCount: number;
  onCartClick: () => void;
  cartOpen: boolean;

  vegOnly: boolean;
  nonVegOnly: boolean;

  setVegOnly: (value: boolean) => void;
  setNonVegOnly: (value: boolean) => void;
};

import { useEffect, useState } from "react";
export default function Navbar({
  cartCount,
  onCartClick,
  cartOpen,

  vegOnly,
  nonVegOnly,

  setVegOnly,
  setNonVegOnly,
}: Props) {
  const [animateCart, setAnimateCart] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;

    setAnimateCart(true);

    const timer = setTimeout(() => {
      setAnimateCart(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [cartCount]);
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-orange-500 ${
        cartOpen ? "hidden" : ""
      }`}
    >
      <div
        className="
  max-w-7xl
  mx-auto
  px-3
  md:px-6
  py-3
  flex
  flex-wrap
  justify-between
  items-center
  gap-3
  "
      >
        <div className="flex items-center">
          <img
            src="/mannakitchensticker.png"
            alt="Manna Kitchen"
            className="w-15 h-15 md:hidden"
          />

          <h1
            className="
    hidden
    md:block
    text-2xl
    font-bold
    text-orange-500
    "
          >
            MANNA KITCHEN
          </h1>
        </div>

        <div
          className="
  flex
  flex-wrap
  items-center
  justify-end
  gap-2
  md:gap-4
  "
        >
          <div className="flex gap-2">
            {/* VEG */}

            <button
              onClick={() => {
                setVegOnly(!vegOnly);

                if (!vegOnly) {
                  setNonVegOnly(false);
                }
              }}
            >
              <div
                className={`w-12 md:w-20 h-7 md:h-10 rounded-full relative transition-all duration-300 ${
                  vegOnly
                    ? "bg-green-500 shadow-lg shadow-green-500/40"
                    : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-1 transition-all duration-300 ${
                    vegOnly ? "left-7 md:left-11" : "left-0.5"
                  }`}
                >
                  <div className="w-5 h-5 md:w-8 md:h-8 border-2 border-green-600 rounded-md bg-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </button>

            {/* NON VEG */}

            <button
              onClick={() => {
                setNonVegOnly(!nonVegOnly);

                if (!nonVegOnly) {
                  setVegOnly(false);
                }
              }}
            >
              <div
                className={`w-12 md:w-20 h-7 md:h-10 rounded-full relative transition-all duration-300 ${
                  nonVegOnly
                    ? "bg-red-500 shadow-lg shadow-red-500/40"
                    : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-1 transition-all duration-300 ${
                    nonVegOnly ? "left-6 md:left-11" : "left-1"
                  }`}
                >
                  <div className="w-5 h-5 md:w-8 md:h-8 border-2 border-red-500 rounded-md bg-white flex items-center justify-center">
                    <div
                      className="
        w-0 h-0
        border-l-[6px]
        border-r-[6px]
        border-b-[12px]
        border-l-transparent
        border-r-transparent
        border-b-red-500
      "
                    />
                  </div>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={onCartClick}
            className="
bg-zinc-900
border-2
border-orange-500
px-3
md:px-4
py-2
rounded-xl
font-bold
text-base
md:text-base
flex
items-center
gap-2
"
          >
            <div className="flex items-center gap-2">
              <FaShoppingCart
                className={`transition-transform duration-300 ${
                  animateCart ? "scale-125" : "scale-100"
                }`}
              />

              <span className="hidden md:inline">Cart</span>

              <span
                className={`
      min-w-6
      h-6
      px-2
      rounded-full
      flex
      items-center
      justify-center
      bg-orange-500
      text-white
      text-xs
      font-bold
      transition-all
      duration-300
      ${animateCart ? "scale-125 shadow-lg shadow-orange-500" : ""}
    `}
              >
                {cartCount}
              </span>
            </div>
          </button>

          <a
            href="https://wa.me/917045202965"
            target="_blank"
            className="
  bg-green-500
  px-1
  md:px-4
  py-1
  rounded-lg
  font-bold
  "
          >
            <span className="md:hidden">
              <FaWhatsapp size={24} />
            </span>

            <span className="hidden md:block">WhatsApp</span>
          </a>

          <a
            href="https://instagram.com/manna_kitchen.in"
            target="_blank"
            className="
  bg-pink-800
  px-1  
  md:px-4
  py-1
  rounded-lg
  font-bold
  "
          >
            <span className="md:hidden">
              <FaInstagram size={24} />
            </span>

            <span className="hidden md:block">Instagram</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
