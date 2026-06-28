export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[99999]">
      <img
        src="/mannakitchensticker.png"
        alt="Loading"
        className="w-48 animate-pulse"
      />
    </div>
  );
}