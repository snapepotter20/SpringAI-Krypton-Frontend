import { MoonStar } from "lucide-react";

export default function HeroStrip({ title, subtitle, isBooting }) {
  return (
    <div className="hero-strip">
      <div>
        <div className="eyebrow">
          <MoonStar size={15} />
          Memory online
        </div>
        <h1>{isBooting ? "Loading Krypton..." : title}</h1>
        <p className="hero-copy">
          {isBooting
            ? "Bringing your chat threads and context online."
            : subtitle}
        </p>
      </div>
      <div className="status-pill">
        <span />
        Backend proxy ready
      </div>
    </div>
  );
}
