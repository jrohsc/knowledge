import { illustrations } from "@/content/illustrations";
import { SketchDrawing } from "./SketchDrawing";
export function ConceptSketch({
  topic,
  hero = false,
}: {
  topic: string;
  hero?: boolean;
}) {
  const concept = illustrations[topic];
  if (!concept) return null;
  return (
    <figure
      className={`concept-sketch${hero ? " concept-sketch-hero" : ""}`}
      aria-label={`${concept.title} — 세 장면으로 이해하기`}
    >
      <header>
        <span className="eyebrow">세 장면으로 이해하기</span>
        <h2>{concept.title}</h2>
      </header>
      <ol className="sketch-sequence">
        {concept.beats.map((beat, i) => (
          <li key={beat.title}>
            <SketchDrawing topic={topic} stage={i} />
            <div className="sketch-explanation">
              <span className="sketch-step">0{i + 1}</span>
              <h3>{beat.title}</h3>
              <p>{beat.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption>{concept.note}</figcaption>
    </figure>
  );
}
