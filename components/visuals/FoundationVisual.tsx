"use client";
import { useState } from "react";
import { VisualFrame } from "./primitives";
const ink = "var(--ink)",
  green = "var(--green)",
  blue = "var(--blue)",
  gold = "var(--gold)";
const explanations: Record<string, { title: string; note: string }> = {
  enlightenment: {
    title: "권위에서 근거로, 근거에서 공론으로",
    note: "이성적 비판은 기존 제도를 재검토하는 언어를 제공했습니다. 사상에서 혁명으로 향하는 필연적인 단일 경로를 뜻하지는 않습니다.",
  },
  hangul: {
    title: "낱소리를 모아 음절을 쓰다",
    note: "자음·모음은 소리의 단위이고, 모아 쓴 글자 덩어리는 음절의 단위입니다. 현대 자모의 조합 예시입니다.",
  },
  empiricism: {
    title: "같은 주장에도 서로 다른 근거가 필요하다",
    note: "경험과 추론은 함께 사용됩니다. 관찰로 지지되는 주장과 정의·전제에서 도출되는 결론을 구분해보세요.",
  },
  energy: {
    title: "형태는 달라도 합은 같다",
    note: "초기 위치 에너지 100 J를 기준으로 한 개념 모형입니다. 물체·지구·주변을 포함하며, 슬라이더는 시간을 재현하지 않습니다. 마찰 모드에서는 잃은 위치 에너지의 30%가 내부 에너지로 전환된다고 가정합니다.",
  },
  "chemical-bond": {
    title: "공유하는 전자와 끌어당기는 전하",
    note: "전자 분포와 이온 격자의 개념도입니다. 원자의 실제 크기·전자 궤도를 재현하지 않으며, 공유성과 이온성은 완전히 분리된 두 상자만은 아닙니다.",
  },
  cell: {
    title: "경계 · 정보 · 합성 · 에너지 전환",
    note: "전형적인 동물 진핵세포를 단순화했습니다. 크기 비율과 소기관 수는 실제와 다르며 원핵세포에는 막성 핵이 없습니다.",
  },
  integral: {
    title: "작은 기여를 더하면 전체가 보인다",
    note: "f(x)=x, 구간 [0, 2]에서 왼쪽 끝 높이로 계산한 직사각형 합입니다. 분할을 늘리면 실제 넓이 2에 아래쪽에서 접근합니다.",
  },
};
const cellParts = [
  [
    "세포막",
    "안과 밖을 구분하며 물질 교환을 조절합니다. 벽처럼 모든 이동을 막지는 않습니다.",
  ],
  [
    "핵",
    "대부분의 유전 정보를 담습니다. 모든 세포에 막성 핵이 있는 것은 아닙니다.",
  ],
  ["리보솜", "RNA의 정보를 읽으며 아미노산을 연결해 단백질을 합성합니다."],
  ["미토콘드리아", "에너지를 새로 만들지 않고 전환하며 ATP 생산에 기여합니다."],
];
export function FoundationVisual({ topic }: { topic: string }) {
  const [value, setValue] = useState(4),
    [mode, setMode] = useState(0);
  const info = explanations[topic];
  if (!info) return null;
  const height = Math.min(value, 10) * 10;
  const heat = mode ? (100 - height) * 0.3 : 0;
  const kinetic = 100 - height - heat;
  const n = Math.max(2, value);
  const sum = 2 - 2 / n;
  let controls;
  if (topic === "integral")
    controls = (
      <>
        <label>
          구간 나누기
          <input
            aria-label="직사각형 개수"
            type="range"
            min="2"
            max="40"
            value={n}
            onChange={(e) => setValue(+e.target.value)}
          />
        </label>
        <output className="control-readout">
          {n}개 · 근삿값 {sum.toFixed(3)} / 정확한 값 2
        </output>
      </>
    );
  if (topic === "energy")
    controls = (
      <>
        <label>
          높이 선택
          <input
            aria-label="남은 높이 비율"
            type="range"
            min="0"
            max="10"
            value={Math.min(value, 10)}
            onChange={(e) => setValue(+e.target.value)}
          />
        </label>
        <button
          className="button secondary"
          aria-pressed={!!mode}
          onClick={() => setMode((m) => (m ? 0 : 1))}
        >
          {mode ? "마찰 있음" : "마찰 없음"}
        </button>
        <output className="control-readout">
          위치 {height} + 운동 {kinetic.toFixed(0)} + 내부 {heat.toFixed(0)} =
          100 J
        </output>
      </>
    );
  if (topic === "cell")
    controls = (
      <>
        <div className="foundation-tabs">
          {cellParts.map(([name], i) => (
            <button
              key={name}
              className="button secondary"
              aria-pressed={mode === i}
              onClick={() => setMode(i)}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="foundation-explanation" aria-live="polite">
          {cellParts[mode][1]}
        </p>
      </>
    );
  if (topic === "hangul")
    controls = (
      <div className="foundation-tabs">
        {["가", "간", "한"].map((s, i) => (
          <button
            key={s}
            className="button secondary"
            aria-pressed={mode === i}
            onClick={() => setMode(i)}
          >
            {s} 조합
          </button>
        ))}
      </div>
    );
  if (topic === "chemical-bond")
    controls = (
      <div className="foundation-tabs">
        {["공유 결합", "이온 결합"].map((s, i) => (
          <button
            key={s}
            className="button secondary"
            aria-pressed={mode === i}
            onClick={() => setMode(i)}
          >
            {s}
          </button>
        ))}
      </div>
    );
  return (
    <VisualFrame title={info.title} caption={info.note} controls={controls}>
      <svg
        className="foundation-svg"
        viewBox="0 0 560 320"
        role="img"
        aria-label={
          topic === "cell"
            ? `${info.title}: ${cellParts[mode][0]} 선택`
            : info.title
        }
      >
        {topic === "integral" && (
          <g>
            <path d="M65 35V265H505" stroke={ink} fill="none" />
            {Array.from({ length: n }, (_, i) => (
              <rect
                key={i}
                x={65 + (400 * i) / n}
                y={265 - (200 * i) / n}
                width={400 / n}
                height={(200 * i) / n}
                fill="var(--accent-wash)"
                stroke={green}
                strokeWidth=".8"
              />
            ))}
            <path d="M65 265L465 65" stroke={blue} strokeWidth="2.5" />
            <text x="65" y="288">
              0
            </text>
            <text x="459" y="288">
              2
            </text>
            <text x="482" y="260">
              x
            </text>
            <text x="23" y="43">
              f(x)
            </text>
            <text x="335" y="64" fill={blue}>
              f(x) = x
            </text>
            <text x="225" y="160" fill={green}>
              높이 × 폭을 더하기
            </text>
          </g>
        )}
        {topic === "energy" && (
          <g>
            <path
              d="M35 255H225M125 50V245"
              stroke="var(--line-strong)"
              strokeDasharray="4 5"
            />
            <circle cx="125" cy={235 - height * 1.7} r="15" fill={green} />
            <text x="45" y="291">
              높이 {height}%
            </text>
            {[
              { label: "위치", v: height, c: blue },
              { label: "운동", v: kinetic, c: green },
              { label: "내부", v: heat, c: gold },
            ].map((b, i) => (
              <g key={b.label}>
                <rect
                  x={270 + i * 90}
                  y={250 - b.v * 1.8}
                  width="44"
                  height={b.v * 1.8}
                  fill={b.c}
                />
                <text x={292 + i * 90} y="277" textAnchor="middle">
                  {b.label}
                </text>
                <text x={292 + i * 90} y={240 - b.v * 1.8} textAnchor="middle">
                  {b.v.toFixed(0)}
                </text>
              </g>
            ))}
            <text x="280" y="30">
              에너지의 합 = 100 J
            </text>
          </g>
        )}
        {topic === "hangul" && (
          <g textAnchor="middle">
            <text x="125" y="130" style={{ fontSize: 64 }} fill={blue}>
              {mode === 2 ? "ㅎ" : "ㄱ"}
            </text>
            <text x="280" y="130" style={{ fontSize: 64 }} fill={green}>
              ㅏ
            </text>
            <text x="435" y="130" style={{ fontSize: 64 }} fill={gold}>
              {mode ? "ㄴ" : "—"}
            </text>
            <text x="125" y="171">
              첫소리
            </text>
            <text x="280" y="171">
              가운뎃소리
            </text>
            <text x="435" y="171">
              {mode ? "끝소리" : "받침 없음"}
            </text>
            <path
              d="M125 185L250 210M280 185V210M435 185L310 210"
              stroke="var(--line-strong)"
            />
            <text x="280" y="287" style={{ fontSize: 72 }}>
              {["가", "간", "한"][mode]}
            </text>
            <text x="410" y="258" fill="var(--muted)">
              한 음절로 모아 쓰기
            </text>
          </g>
        )}
        {topic === "chemical-bond" &&
          (mode === 0 ? (
            <g textAnchor="middle">
              <ellipse
                cx="220"
                cy="153"
                rx="100"
                ry="80"
                fill="var(--accent-wash)"
                stroke={blue}
              />
              <ellipse
                cx="340"
                cy="153"
                rx="100"
                ry="80"
                fill="none"
                stroke={green}
              />
              <text x="196" y="161" style={{ fontSize: 28 }}>
                H
              </text>
              <text x="364" y="161" style={{ fontSize: 28 }}>
                H
              </text>
              <circle cx="280" cy="138" r="5" fill={ink} />
              <circle cx="280" cy="166" r="5" fill={ink} />
              <text x="280" y="45">
                수소 분자 H₂
              </text>
              <text x="280" y="276">
                두 원자 사이의 전자 분포
              </text>
            </g>
          ) : (
            <g textAnchor="middle">
              {Array.from({ length: 12 }, (_, i) => {
                const positive = (Math.floor(i / 4) + (i % 4)) % 2 === 0;
                return (
                  <g key={i}>
                    <circle
                      cx={145 + (i % 4) * 90}
                      cy={70 + Math.floor(i / 4) * 75}
                      r="26"
                      fill="var(--surface)"
                      stroke={positive ? blue : gold}
                    />
                    <text
                      x={145 + (i % 4) * 90}
                      y={76 + Math.floor(i / 4) * 75}
                      fill={positive ? blue : gold}
                    >
                      {positive ? "Na⁺" : "Cl⁻"}
                    </text>
                  </g>
                );
              })}
              <text x="280" y="294">
                반대 전하가 반복 배열된 격자
              </text>
            </g>
          ))}
        {topic === "cell" && (
          <g>
            <ellipse
              cx="280"
              cy="165"
              rx="223"
              ry="127"
              fill="var(--surface)"
              stroke={mode === 0 ? green : ink}
              strokeWidth={mode === 0 ? 4 : 1.5}
            />
            <ellipse
              cx="220"
              cy="150"
              rx="65"
              ry="55"
              fill="var(--paper)"
              stroke={mode === 1 ? green : blue}
              strokeWidth={mode === 1 ? 4 : 1.5}
            />
            <path d="M192 124q58 12 18 26t26 26" fill="none" stroke={blue} />
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx={310 + i * 21}
                cy={102 + (i % 2) * 17}
                r={mode === 2 ? 6 : 4}
                fill={mode === 2 ? green : ink}
              />
            ))}
            <ellipse
              cx="373"
              cy="208"
              rx="58"
              ry="25"
              fill="var(--paper)"
              stroke={mode === 3 ? green : gold}
              strokeWidth={mode === 3 ? 4 : 1.5}
            />
            <path
              d="M330 207l13-13 14 24 14-24 14 24 14-13"
              fill="none"
              stroke={gold}
            />
            <text x="45" y="30">
              세포막
            </text>
            <path d="M83 36l15 53" stroke={ink} />
            <text x="204" y="227">
              핵
            </text>
            <text x="315" y="79">
              리보솜
            </text>
            <text x="335" y="267">
              미토콘드리아
            </text>
          </g>
        )}
        {topic === "enlightenment" && (
          <g textAnchor="middle">
            <path
              d="M85 119l55-40 55 40M97 125h86M105 125v61m35-61v61m35-61v61M94 190h92"
              fill="none"
              stroke={blue}
              strokeWidth="2"
            />
            <path
              d="M240 101q30-14 40 0q25-14 40 0v76q-25-14-40 0q-20-14-40 0Z M280 101v76"
              fill="none"
              stroke={green}
              strokeWidth="2"
            />
            {[402, 440, 478].map((x) => (
              <g key={x}>
                <circle cx={x} cy="125" r="9" fill="none" stroke={gold} />
                <path
                  d={`M${x} 134v31m0-22-14 13m14-13 14 13m-14 9-12 20m12-20 12 20`}
                  stroke={gold}
                />
              </g>
            ))}
            <path
              d="M196 146h30m95 0h58"
              stroke="var(--line-strong)"
              strokeDasharray="3 4"
            />
            <text x="140" y="226">
              권위에 질문하기
            </text>
            <text x="280" y="226">
              근거를 공개하기
            </text>
            <text x="440" y="226">
              함께 토론하기
            </text>
            <text x="280" y="279" fill="var(--muted)">
              공유된 태도, 서로 다른 정치적 해법
            </text>
          </g>
        )}
        {topic === "empiricism" && (
          <g textAnchor="middle">
            <path
              d="M65 85q65-55 130 0q-65 55-130 0Z"
              fill="none"
              stroke={blue}
              strokeWidth="2"
            />
            <circle cx="130" cy="85" r="16" fill="none" stroke={blue} />
            <text x="393" y="98" style={{ fontSize: 30 }} fill={green}>
              전제 ∴ 결론
            </text>
            <text x="130" y="156" fill={blue}>
              관찰과 경험
            </text>
            <text x="393" y="156" fill={green}>
              정의와 추론
            </text>
            <text x="130" y="187">
              “관찰한 물은 따뜻하다”
            </text>
            <text x="393" y="187">
              “홀수의 나머지는 1이다”
            </text>
            <path
              d="M130 211L280 249 393 211"
              fill="none"
              stroke="var(--line-strong)"
            />
            <text x="280" y="282">
              이 주장에는 어떤 근거가 필요한가?
            </text>
          </g>
        )}
      </svg>
    </VisualFrame>
  );
}
