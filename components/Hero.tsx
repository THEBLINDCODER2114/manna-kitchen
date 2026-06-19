export default function Hero() {
  return (
    <section
      className="
  text-center
  py-10
  md:py-20
  px-4
  "
    >
      <img
        src="/mannakitchensticker.png"
        alt="Manna Kitchen"
        className="
w-40
md:w-64
mx-auto
mb-6
"
      />

      <h1 className="text-4xl md:text-8xl font-extrabold text-orange-500">
        MANNA KITCHEN
      </h1>

      <p className="text-yellow-300 text-2xl mt-6">Crafted For Cravings</p>

      <div className="max-w-4xl mx-auto mt-10 rounded-3xl overflow-hidden">
        <video autoPlay muted loop playsInline className="w-full">
          <source src="/mannahero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* <p className="text-orange-300 mt-4 text-xl">Open Till 5:00 AM 🌙</p> */}
    </section>
  );
}
