import type { ReactNode } from "react";
export function VisualFrame({
  title,
  caption,
  children,
  controls,
}: {
  title: string;
  caption: string;
  children: ReactNode;
  controls?: ReactNode;
}) {
  return (
    <figure className="visual-frame">
      <div className="figure-top">
        <span className="eyebrow">그림으로 이해하기</span>
        <span>{title}</span>
      </div>
      <div className="visual-canvas">{children}</div>
      {controls && <div className="visual-controls">{controls}</div>}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
export function BeforeAfter({
  before,
  after,
  caption,
}: {
  before: string;
  after: string;
  caption: string;
}) {
  return (
    <figure className="before-after">
      <div>
        <span className="eyebrow">이전</span>
        <p>{before}</p>
      </div>
      <span aria-hidden>→</span>
      <div>
        <span className="eyebrow">이후</span>
        <p>{after}</p>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
export function EquationExplainer({
  children,
  caption,
}: {
  children: ReactNode;
  caption: string;
}) {
  return (
    <figure className="equation-explainer">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
export function HistoricalTimeline({
  events,
}: {
  events: { year: number; label: string }[];
}) {
  return (
    <ol className="historical-timeline">
      {events.map((e, i) => (
        <li key={`${e.year}-${i}`}>
          <span className="mono">
            {e.year < 0 ? `기원전 ${-e.year}` : `${e.year}년`}
          </span>
          <p>{e.label}</p>
        </li>
      ))}
    </ol>
  );
}
export function AnnotatedDiagram({
  title,
  children,
  caption,
}: {
  title: string;
  children: ReactNode;
  caption: string;
}) {
  return (
    <VisualFrame title={title} caption={caption}>
      {children}
    </VisualFrame>
  );
}
