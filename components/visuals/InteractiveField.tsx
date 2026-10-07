"use client";
import { useState } from "react";
import { VisualFrame } from "./primitives";
export function InteractiveField() {
  const [m1, setM1] = useState(3),
    [m2, setM2] = useState(3),
    [r, setR] = useState(3);
  const force = (m1 * m2) / r ** 2,
    len = Math.min(r * 35 - 8, force * 18 + 12);
  const c1 = 350 - r * 35,
    c2 = 350 + r * 35;
  return (
    <VisualFrame
      title="질량은 곱하고, 거리는 제곱으로 나눈다"
      caption="정규화한 단위에서 G = 1. 화살표 길이는 큰 힘에서 제한되며 수치는 정확한 상대 힘을 표시합니다. 두 힘은 서로 다른 물체에 작용합니다."
      controls={
        <>
          <div className="slider-grid">
            {[
              { id: "m1", label: "질량 1", v: m1, set: setM1 },
              { id: "m2", label: "질량 2", v: m2, set: setM2 },
              { id: "distance", label: "거리", v: r, set: setR },
            ].map((item) => (
              <label key={item.id} htmlFor={item.id}>
                {item.label} <b>{item.v}</b>
                <input
                  id={item.id}
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={item.v}
                  onChange={(e) => item.set(+e.target.value)}
                />
              </label>
            ))}
          </div>
          <div className="control-readout">
            상대 힘{" "}
            <strong className="mono">
              F = {m1} × {m2} / {r}² = {force.toFixed(2)}
            </strong>
          </div>
        </>
      }
    >
      <svg
        viewBox="0 0 700 280"
        role="img"
        aria-label={`질량 ${m1}, ${m2} 거리 ${r}에서 같은 크기로 마주 당기는 힘 ${force.toFixed(2)}`}
      >
        <defs>
          <marker
            id="force-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10" fill="var(--green)" />
          </marker>
        </defs>
        <line x1={c1} x2={c2} y1="205" y2="205" stroke="var(--muted)" />
        <path d={`M${c1} 198v14M${c2} 198v14`} stroke="var(--muted)" />
        <text x="350" y="234" textAnchor="middle" className="axis-label">
          중심 사이 거리 r = {r}
        </text>
        <circle
          cx={c1}
          cy="110"
          r={12 + Math.sqrt(m1) * 6}
          fill="var(--green)"
          opacity=".2"
        />
        <circle cx={c1} cy="110" r="5" fill="var(--green)" />
        <circle
          cx={c2}
          cy="110"
          r={12 + Math.sqrt(m2) * 6}
          fill="var(--gold)"
          opacity=".25"
        />
        <circle cx={c2} cy="110" r="5" fill="var(--gold)" />
        <line
          x1={c1}
          x2={c1 + len}
          y1="110"
          y2="110"
          stroke="var(--green)"
          strokeWidth="2.5"
          markerEnd="url(#force-arrow)"
        />
        <line
          x1={c2}
          x2={c2 - len}
          y1="110"
          y2="110"
          stroke="var(--green)"
          strokeWidth="2.5"
          markerEnd="url(#force-arrow)"
        />
        <text x={c1} y="40" textAnchor="middle">
          m₁ = {m1}
        </text>
        <text x={c2} y="40" textAnchor="middle">
          m₂ = {m2}
        </text>
        <text x="350" y="175" textAnchor="middle" className="axis-label">
          같은 크기 · 반대 방향
        </text>
      </svg>
    </VisualFrame>
  );
}
