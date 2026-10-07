"use client";
import { useState } from "react";
import { line } from "d3-shape";
import { VisualFrame } from "./primitives";
export function ProbabilityExperiment() {
  const [p, setP] = useState(0.5),
    [results, setResults] = useState<number[]>([]);
  const n = results.length,
    heads = results.reduce((a, b) => a + b, 0);
  let sum = 0;
  const points = results.map((v, i) => {
    sum += v;
    return [
      55 + ((i + 1) / Math.max(100, n)) * 590,
      260 - (sum / (i + 1)) * 210,
    ] as [number, number];
  });
  return (
    <VisualFrame
      title="한 번의 우연, 여러 번의 경향"
      caption="독립적인 동전 시행을 의사난수로 생성합니다. 반복 횟수가 커져도 다음 한 번의 결과를 보장하지는 않습니다. 최대 5,000회."
      controls={
        <>
          <label htmlFor="probability-p">
            앞면의 이론적 확률 <b>{(p * 100).toFixed(0)}%</b>
          </label>
          <input
            id="probability-p"
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={p}
            onChange={(e) => {
              setP(+e.target.value);
              setResults([]);
            }}
          />
          <div className="button-row">
            <button
              className="button"
              disabled={n >= 5000}
              onClick={() =>
                setResults((r) => [
                  ...r,
                  ...Array.from(
                    { length: Math.min(100, 5000 - r.length) },
                    () => (Math.random() < p ? 1 : 0),
                  ),
                ])
              }
            >
              100회 던지기
            </button>
            <button className="text-button" onClick={() => setResults([])}>
              다시 시작
            </button>
            <span className="mono">
              {n}회 · 앞면 {n ? `${((heads / n) * 100).toFixed(1)}%` : "—"}
            </span>
          </div>
        </>
      }
    >
      <svg
        viewBox="0 0 700 315"
        role="img"
        aria-label={`동전 ${n}회 시행, 앞면 ${heads}회. 관측 비율과 이론적 확률 비교`}
      >
        <path d="M55 35V260H650" className="axis" />
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line
              x1="55"
              x2="650"
              y1={260 - v * 210}
              y2={260 - v * 210}
              className="gridline"
            />
            <text
              x="43"
              y={265 - v * 210}
              textAnchor="end"
              className="axis-label"
            >
              {v}
            </text>
          </g>
        ))}
        <line
          x1="55"
          x2="650"
          y1={260 - p * 210}
          y2={260 - p * 210}
          stroke="var(--gold)"
          strokeDasharray="5 5"
        />
        <path
          d={line()(points) ?? ""}
          stroke="var(--blue)"
          strokeWidth="2"
          fill="none"
        />
        {!n && (
          <text x="350" y="110" textAnchor="middle" className="axis-label">
            아래에서 동전을 던져 관측 비율을 그려보세요.
          </text>
        )}
        <text x="55" y="286" className="axis-label">
          0회
        </text>
        <text x="640" y="286" textAnchor="end" className="axis-label">
          {Math.max(100, n)}회
        </text>
        <text x="390" y="22" className="axis-label">
          실선: 관측 비율 / 점선: 이론적 확률
        </text>
      </svg>
    </VisualFrame>
  );
}
