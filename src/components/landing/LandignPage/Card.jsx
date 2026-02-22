export default function Card({ title, description }) {
  return (
    <div className="card w-full h-full flex flex-col items-center justify-center text-center p-10">
      <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
        {title}
      </h2>
      <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
}
