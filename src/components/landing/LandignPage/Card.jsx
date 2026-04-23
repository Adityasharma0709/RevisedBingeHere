export default function Card({ title, description }) {
  return (
    <div className="card w-full h-full flex flex-col items-center justify-center text-center px-6 py-16 sm:px-10 md:px-16">
      <div className="w-full max-w-4xl">
        <h2
          className="text-[clamp(2.5rem,6vw,5.25rem)] font-extrabold text-white uppercase leading-[0.9] tracking-[-0.03em]"
          style={{ textWrap: "balance" }}
        >
          {title}
        </h2>
        <p
          className="mt-6 text-[clamp(1.05rem,1.75vw,1.35rem)] text-white/75 max-w-[62ch] mx-auto leading-[1.7] font-normal"
          style={{ textWrap: "pretty" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
