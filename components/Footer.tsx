export default function Footer() {
  return (
    <footer className="border-t border-orange-500 py-12 mt-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">
          MANNA KITCHEN
        </h2>

        <div className="flex flex-col gap-3 text-lg">
          <p>📞 9326928159</p>

          <p>📸 @manna_kitchen.in</p>

          <p>📧 mannakitchenz.in@gmail.com</p>
        </div>

        {/* <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <a
            href="https://wa.me/919326928159"
            target="_blank"
            className="bg-green-500 px-6 py-3 rounded-xl font-bold"
          >
            WhatsApp Order
          </a>

          <a
            href="https://instagram.com/manna_kitchen.in"
            target="_blank"
            className="bg-orange-500 px-6 py-3 rounded-xl font-bold"
          >
            Instagram
          </a>
        </div> */}
      </div>
    </footer>
  );
}