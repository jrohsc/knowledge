"use client";
import { useState } from "react";
import { VisualFrame } from "./primitives";
export function ParticleSimulation() {
  const [spread, setSpread] = useState(0);
  return (
    <VisualFrame
      title="모이는 방식보다, 퍼지는 방식이 훨씬 많다"
      caption="공간 분포만 보여주는 설명용 모형입니다. 슬라이더는 분포를 보간하며, 실제 입자의 충돌이나 열역학적 엔트로피를 계산하지 않습니다."
      controls={
        <>
          <label htmlFor="entropy-spread">
            분포 살펴보기{" "}
            <strong>
              {spread < 20
                ? "한쪽에 모인 상태"
                : spread < 80
                  ? "퍼지는 중"
                  : "전체에 퍼진 상태"}
            </strong>
          </label>
          <input
            id="entropy-spread"
            type="range"
            min="0"
            max="100"
            value={spread}
            onChange={(e) => setSpread(+e.target.value)}
          />
        </>
      }
    >
      <svg
        viewBox="0 0 700 310"
        role="img"
        aria-label="입자들이 왼쪽 공간에 모인 상태에서 용기 전체에 퍼진 상태로 변화"
      >
        <rect
          x="50"
          y="30"
          width="600"
          height="205"
          rx="2"
          fill="none"
          stroke="var(--line-strong)"
        />
        <line
          x1="230"
          x2="230"
          y1="30"
          y2="235"
          stroke="var(--line-strong)"
          strokeDasharray="4 5"
          opacity={1 - spread / 100}
        />
        {Array.from({ length: 64 }, (_, i) => {
          const startX = 70 + (i % 8) * 19,
            startY = 50 + Math.floor(i / 8) * 23,
            endX = 65 + ((i * 137) % 566),
            endY = 47 + ((i * 83) % 170);
          return (
            <circle
              key={i}
              cx={startX + ((endX - startX) * spread) / 100}
              cy={startY + ((endY - startY) * spread) / 100}
              r="4.5"
              fill={i % 3 === 0 ? "var(--gold)" : "var(--green)"}
              opacity=".85"
            />
          );
        })}
        <text x="50" y="270" className="diagram-label">
          적은 수의 배치
        </text>
        <path d="M210 265H440m-8-5 8 5-8 5" fill="none" stroke="var(--muted)" />
        <text x="465" y="270" className="diagram-label">
          압도적으로 많은 배치
        </text>
        <text x="50" y="294" className="axis-label">
          낮은 엔트로피
        </text>
        <text x="465" y="294" className="axis-label">
          높은 엔트로피
        </text>
      </svg>
    </VisualFrame>
  );
}
