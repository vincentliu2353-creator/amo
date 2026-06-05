const processItems = [
  {
    step: "01",
    title: "Application framing",
    text: "Motion envelope, payload, cleanliness, software ownership, and takt targets are defined against the manufacturing process.",
  },
  {
    step: "02",
    title: "Rapid concept architecture",
    text: "AMO maps product modules or OEM motion cores into the machine concept and identifies integration boundaries early.",
  },
  {
    step: "03",
    title: "Pilot validation",
    text: "Controllers, carrier logic, and mechanical interfaces are tuned around sample parts, station timing, and risk constraints.",
  },
  {
    step: "04",
    title: "Scale manufacturing",
    text: "The program moves into line release, white-label delivery, and region-specific support after the pilot build proves the platform.",
  },
];

export function ProcessGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {processItems.map((item) => (
        <article key={item.step} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-glow">
          <p className="text-xs uppercase tracking-[0.26em] text-cyan-100/80">{item.step}</p>
          <h3 className="mt-4 font-display text-2xl text-white">{item.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

