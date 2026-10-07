"use client";
import { useState } from "react";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { VisualFrame } from "./primitives";
const x = scaleLinear().domain([0, 3.4]).range([65, 645]),
  y = scaleLinear().domain([0, 10]).range([300, 35]);
export function InteractiveFunction() {
  const [dx, setDx] = useState(1.5);
  const a = 1,
    b = a + dx,
    slope = 2 + dx;
  const curve = line<[number, number]>()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]))(
    Array.from({ length: 101 }, (_, i) => [i * 0.031, i * 0.031 * i * 0.031]),
  );
  return (
    <VisualFrame
      title="할선에서 접선으로"
      caption="f(x) = x², A의 x좌표는 1. 간격을 줄일수록 평균 변화율은 접선의 기울기 2에 가까워집니다."
      controls={
        <>
          <label htmlFor="derivative-dx">
            두 점 사이 간격 Δx <strong className="mono">{dx.toFixed(2)}</strong>
          </label>
          <input
            id="derivative-dx"
            type="range"
            min="0.01"
            max="2"
            step="0.01"
            value={dx}
            onChange={(e) => setDx(+e.target.value)}
          />
          <div className="control-readout">
            <span>
              평균 변화율 <b>{slope.toFixed(2)}</b>
            </span>
            <span>
              순간 변화율 <b>2.00</b>
            </span>
          </div>
        </>
      }
    >
      <svg
        viewBox="0 0 700 355"
        role="img"
        aria-label={`포물선 위 A와 B의 간격 ${dx.toFixed(2)}, 할선 기울기 ${slope.toFixed(2)}, 접선 기울기 2`}
      >
        <defs>
          <clipPath id="plot-clip">
            <rect x="60" y="20" width="590" height="285" />
          </clipPath>
        </defs>
        {[2, 4, 6, 8, 10].map((v) => (
          <g key={v}>
            <line className="gridline" x1="65" x2="650" y1={y(v)} y2={y(v)} />
            <text className="axis-label" x="48" y={y(v) + 5} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <path className="axis" d="M65 30V300H650" />
        {[0, 1, 2, 3].map((v) => (
          <text
            className="axis-label"
            key={v}
            x={x(v)}
            y="326"
            textAnchor="middle"
          >
            {v}
          </text>
        ))}
        <text x="660" y="307" className="axis-label">
          x
        </text>
        <text x="65" y="20" className="axis-label">
          y
        </text>
        <g clipPath="url(#plot-clip)">
          <path d={curve!} fill="none" stroke="var(--ink)" strokeWidth="2.5" />
          <line
            x1={x(0)}
            y1={y(-1)}
            x2={x(3.4)}
            y2={y(5.8)}
            stroke="var(--muted)"
            strokeDasharray="6 5"
            strokeWidth="1.5"
          />
          <line
            x1={x(0)}
            y1={y(1 - slope)}
            x2={x(3.4)}
            y2={y(1 + slope * 2.4)}
            stroke="var(--blue)"
            strokeWidth="2.5"
          />
          <path
            d={`M${x(a)},${y(1)}H${x(b)}V${y(b * b)}`}
            stroke="var(--blue)"
            fill="none"
            strokeDasharray="3 4"
          />
        </g>
        <circle cx={x(a)} cy={y(1)} r="6" fill="var(--ink)" />
        <circle cx={x(b)} cy={y(b * b)} r="6" fill="var(--blue)" />
        <text x={x(a) - 22} y={y(1) - 13}>
          A
        </text>
        <text x={x(b) + 12} y={y(b * b) - 8} fill="var(--blue)">
          B
        </text>
        <text x="540" y="30" className="axis-label">
          f(x) = x²
        </text>
        <text x="450" y="215" className="axis-label">
          점선: A에서의 접선
        </text>
      </svg>
    </VisualFrame>
  );
}
