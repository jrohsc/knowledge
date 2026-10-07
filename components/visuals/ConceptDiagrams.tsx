"use client";
import { useState } from "react";
import { VisualFrame } from "./primitives";
export function CausalFlow({
  causes = ["재정 위기", "신분 특권", "대표권 갈등", "생활의 불안"],
  event = "1789년, 혁명",
  outcomes = ["입헌군주제 시도", "공화국과 급진화", "나폴레옹의 집권"],
}: {
  causes?: string[];
  event?: string;
  outcomes?: string[];
}) {
  return (
    <VisualFrame
      title="하나의 원인이 아니라, 겹쳐진 압력"
      caption="위에서 아래로 읽습니다. 화살표는 필연적인 결말이 아니라 갈등과 선택을 거치며 이어진 역사적 흐름을 뜻합니다."
    >
      <svg
        viewBox="0 0 700 380"
        role="img"
        aria-label={`${causes.join(", ")}에서 ${event}, 이어 ${outcomes.join(", ")}`}
      >
        {causes.map((c, i) => {
          const x = 90 + (i * 520) / (causes.length - 1 || 1);
          return (
            <g key={c}>
              <text x={x} y="44" textAnchor="middle" className="diagram-label">
                {c}
              </text>
              <path
                d={`M${x} 60V85Q${x} 110 350 125`}
                fill="none"
                stroke="var(--line-strong)"
              />
              <circle cx={x} cy="62" r="3" fill="var(--gold)" />
            </g>
          );
        })}
        <line
          x1="350"
          x2="350"
          y1="125"
          y2="360"
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
        <rect x="235" y="133" width="230" height="53" fill="var(--paper)" />
        <text x="350" y="167" className="diagram-title" textAnchor="middle">
          {event}
        </text>
        {outcomes.map((t, i) => (
          <g key={t}>
            <circle cx="350" cy={220 + i * 57} r="4" fill="var(--gold)" />
            <text
              x={i % 2 ? 370 : 330}
              y={226 + i * 57}
              textAnchor={i % 2 ? "start" : "end"}
            >
              {t}
            </text>
          </g>
        ))}
      </svg>
    </VisualFrame>
  );
}
export function CaveDiagram() {
  const [step, setStep] = useState(0);
  const descriptions = [
    "그림자가 세계의 전부라고 믿는다. 익숙한 경험과 실재를 구분하지 못하는 상태다.",
    "뒤를 돌아 불과 사물을 본다. 익숙했던 설명이 흔들리고 배움의 불편함이 시작된다.",
    "동굴 밖에서 시야를 넓힌다. 더 잘 알게 된 사람에게 공동체로 돌아갈 책임이 남는다.",
  ];
  return (
    <VisualFrame
      title="그림자에서 사물로, 사물에서 앎의 조건으로"
      caption={descriptions[step]}
      controls={
        <div className="segmented" aria-label="설명의 단계">
          {["1 그림자", "2 방향 전환", "3 동굴 밖"].map((s, i) => (
            <button
              key={s}
              aria-pressed={step === i}
              onClick={() => setStep(i)}
            >
              {s}
            </button>
          ))}
        </div>
      }
    >
      <svg
        viewBox="0 0 700 330"
        role="img"
        aria-label="왼쪽 동굴의 그림자와 죄수, 가운데 불빛, 오른쪽 동굴 밖의 태양"
      >
        <path
          d="M35 270V50Q145 2 255 42T475 90L495 265"
          fill="var(--ink)"
          opacity=".055"
        />
        <path
          d="M35 270V50Q145 2 255 42T475 90"
          fill="none"
          stroke="var(--line-strong)"
        />
        <line
          x1="65"
          x2="65"
          y1="80"
          y2="257"
          stroke="var(--muted)"
          strokeWidth="3"
        />
        <path d="M345 183L70 82V244Z" fill="var(--gold)" opacity=".13" />
        <path
          d="M305 233l19-43 12 21 11-46 15 69"
          fill="var(--gold)"
          opacity=".7"
        />
        <g stroke="var(--ink)" fill="none" strokeWidth="3">
          <circle cx="170" cy="180" r="11" />
          <path d="M170 191v40l-25 20m25-20 26 20m-26-39-22 12" />
        </g>
        <path
          d="M68 135v74m0-49 17 20m-17 5 17 36"
          stroke="var(--muted)"
          strokeWidth="7"
          opacity=".5"
        />
        <path
          d="M245 240v-67l15-24 15 24v67"
          fill="var(--muted)"
          opacity={step >= 1 ? 0.55 : 0.2}
        />
        <circle
          cx="595"
          cy="78"
          r="31"
          fill="var(--gold)"
          opacity={step === 2 ? 0.8 : 0.2}
        />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1={595 + 42 * Math.cos((i * Math.PI) / 6)}
            y1={78 + 42 * Math.sin((i * Math.PI) / 6)}
            x2={595 + 50 * Math.cos((i * Math.PI) / 6)}
            y2={78 + 50 * Math.sin((i * Math.PI) / 6)}
            stroke="var(--gold)"
          />
        ))}
        <path
          d="M200 260Q360 287 555 230"
          stroke="var(--green)"
          strokeDasharray="5 5"
          fill="none"
        />
        <text x="68" y="300" className="axis-label">
          벽의 그림자
        </text>
        <text x="268" y="300" className="axis-label">
          사물과 불빛
        </text>
        <text x="522" y="300" className="axis-label">
          태양 · 앎의 조건
        </text>
      </svg>
    </VisualFrame>
  );
}
export function ArgumentMap({
  claim = "용기는 두려움이 없는 것이다",
  objection = "위험을 모르는 행동도 용감한가?",
  response = "알고 두려워하면서도 행동할 수 있다",
}: {
  claim?: string;
  objection?: string;
  response?: string;
}) {
  const [reveal, setReveal] = useState(false);
  return (
    <VisualFrame
      title="좋은 질문은 정의를 다시 보게 한다"
      caption="정의 → 반례 → 수정. 마지막 문장도 완성된 정답이 아니라 다음 질문의 출발점입니다."
      controls={
        <button className="text-button" onClick={() => setReveal((v) => !v)}>
          {reveal ? "질문으로 돌아가기" : "다른 가능성 살펴보기"} →
        </button>
      }
    >
      <div className="argument-diagram">
        <div>
          <span className="eyebrow">처음의 주장</span>
          <h3>{claim}</h3>
        </div>
        <div className="objection">
          <span className="eyebrow">반례로 묻기</span>
          <h3>{objection}</h3>
        </div>
        <div className="response">
          <span className="eyebrow">생각 고쳐 보기</span>
          <p>
            {reveal
              ? response
              : "위험을 알면서 다른 사람을 구하는 경우를 떠올려보세요."}
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}
export function ProcessDiagram() {
  const [step, setStep] = useState(0);
  return (
    <VisualFrame
      title="저장된 서열이 기능하는 분자가 되기까지"
      caption={
        [
          "DNA의 두 가닥은 상보적인 염기쌍으로 연결됩니다. 그림은 분자 구조를 단순화했습니다.",
          "전사: DNA의 일부를 바탕으로 RNA를 만듭니다. RNA 전체가 단백질로 번역되는 것은 아닙니다.",
          "번역: 리보솜이 mRNA의 코돈을 읽으며 아미노산을 연결합니다. 만들어진 사슬은 접혀 기능합니다.",
        ][step]
      }
      controls={
        <div className="segmented">
          {["1 DNA", "2 전사", "3 번역"].map((t, i) => (
            <button
              key={t}
              aria-pressed={step === i}
              onClick={() => setStep(i)}
            >
              {t}
            </button>
          ))}
        </div>
      }
    >
      <svg
        viewBox="0 0 700 330"
        role="img"
        aria-label="이중나선 DNA에서 단일가닥 RNA가 전사되고 리보솜에서 아미노산 사슬로 번역되는 과정"
      >
        <text x="105" y="35" className="diagram-title" textAnchor="middle">
          DNA
        </text>
        {Array.from({ length: 15 }, (_, i) => {
          const y = 65 + i * 12,
            x1 = 105 + 32 * Math.sin(i * 0.6),
            x2 = 105 - 32 * Math.sin(i * 0.6);
          return (
            <g key={i}>
              <line x1={x1} x2={x2} y1={y} y2={y} stroke="var(--line-strong)" />
              <circle cx={x1} cy={y} r="4" fill="var(--blue)" />
              <circle cx={x2} cy={y} r="4" fill="var(--gold)" />
            </g>
          );
        })}
        <path d="M175 155H259m-8-5 8 5-8 5" stroke="var(--muted)" fill="none" />
        <text x="216" y="135" textAnchor="middle" className="axis-label">
          전사
        </text>
        <g opacity={step >= 1 ? 1 : 0.35}>
          <text x="334" y="35" className="diagram-title" textAnchor="middle">
            RNA
          </text>
          <path
            d="M315 65Q365 97 315 130T315 195T330 250"
            fill="none"
            stroke="var(--green)"
            strokeWidth="4"
          />
          {["A", "U", "G", "C", "A", "U"].map((t, i) => (
            <text
              key={i}
              x={342 + (i % 2 ? 8 : 0)}
              y={82 + i * 30}
              className="axis-label"
              fill="var(--green)"
            >
              {t}
            </text>
          ))}
        </g>
        <path d="M390 155H465m-8-5 8 5-8 5" stroke="var(--muted)" fill="none" />
        <text x="428" y="135" textAnchor="middle" className="axis-label">
          번역
        </text>
        <g opacity={step === 2 ? 1 : 0.35}>
          <text x="565" y="35" className="diagram-title" textAnchor="middle">
            단백질
          </text>
          <ellipse
            cx="555"
            cy="186"
            rx="52"
            ry="31"
            fill="var(--gold)"
            opacity=".2"
          />
          <ellipse
            cx="555"
            cy="222"
            rx="46"
            ry="20"
            fill="var(--gold)"
            opacity=".35"
          />
          <path d="M475 207h174" stroke="var(--green)" strokeWidth="3" />
          {Array.from({ length: 10 }, (_, i) => (
            <circle
              key={i}
              cx={550 + Math.sin(i * 0.9) * 25}
              cy={170 - i * 10}
              r="6"
              fill={i % 2 ? "var(--blue)" : "var(--gold)"}
            />
          ))}
          <text x="555" y="268" textAnchor="middle" className="axis-label">
            리보솜과 아미노산 사슬
          </text>
        </g>
        <text x="65" y="304" className="axis-label">
          정보의 저장
        </text>
        <text x="291" y="304" className="axis-label">
          정보의 전달
        </text>
        <text x="520" y="304" className="axis-label">
          기능의 구현
        </text>
      </svg>
    </VisualFrame>
  );
}
export function EvolutionTree() {
  const [generation, setGeneration] = useState(0),
    [environment, setEnvironment] = useState("brown");
  const p =
    1 / (1 + Math.pow(environment === "brown" ? 0.65 : 1 / 0.65, generation));
  return (
    <VisualFrame
      title="개체가 아니라, 집단의 비율이 바뀐다"
      caption="두 형질이 유전되고 번식 성공만 다른 단순 모형입니다. 갈색 배경은 갈색 형질, 초록 배경은 초록 형질에 유리합니다. 개체 그림은 비율을 반올림한 표본입니다."
      controls={
        <>
          <div className="segmented">
            <button
              aria-pressed={environment === "brown"}
              onClick={() => {
                setEnvironment("brown");
                setGeneration(0);
              }}
            >
              갈색 환경
            </button>
            <button
              aria-pressed={environment === "green"}
              onClick={() => {
                setEnvironment("green");
                setGeneration(0);
              }}
            >
              초록 환경
            </button>
          </div>
          <label htmlFor="generation">
            세대 <b>{generation}</b>
          </label>
          <input
            id="generation"
            type="range"
            min="0"
            max="8"
            value={generation}
            onChange={(e) => setGeneration(+e.target.value)}
          />
        </>
      }
    >
      <svg
        viewBox="0 0 700 300"
        role="img"
        aria-label={`${generation}세대에서 갈색 형질의 예상 비율 ${(p * 100).toFixed(0)}퍼센트`}
      >
        <rect
          x="35"
          y="40"
          width="400"
          height="220"
          fill={environment === "brown" ? "var(--gold)" : "var(--green)"}
          opacity=".08"
        />
        {Array.from({ length: 40 }, (_, i) => (
          <g
            key={i}
            transform={`translate(${58 + (i % 10) * 39},${75 + Math.floor(i / 10) * 49})`}
          >
            <ellipse
              rx="9"
              ry="13"
              fill={i < Math.round(p * 40) ? "var(--gold)" : "var(--green)"}
            />
            <path
              d="M-8-6l-7-5m7 17-7 5M8-6l7-5m-7 17 7 5M0-11v23"
              stroke="var(--paper)"
              strokeWidth="1.5"
            />
          </g>
        ))}
        <text x="480" y="93" className="axis-label">
          갈색 형질
        </text>
        <text x="480" y="149" className="big-number">
          {(p * 100).toFixed(0)}%
        </text>
        <text x="480" y="192" className="axis-label">
          시작 50% → {generation}세대
        </text>
        <text x="480" y="222" className="axis-label">
          환경에 따라 유리함이 달라진다
        </text>
      </svg>
    </VisualFrame>
  );
}
const elements = [
  ["H", "수소", 1, 1],
  ["He", "헬륨", 18, 1],
  ["Li", "리튬", 1, 2],
  ["Be", "베릴륨", 2, 2],
  ["B", "붕소", 13, 2],
  ["C", "탄소", 14, 2],
  ["N", "질소", 15, 2],
  ["O", "산소", 16, 2],
  ["F", "플루오린", 17, 2],
  ["Ne", "네온", 18, 2],
  ["Na", "나트륨", 1, 3],
  ["Mg", "마그네슘", 2, 3],
  ["Al", "알루미늄", 13, 3],
  ["Si", "규소", 14, 3],
  ["P", "인", 15, 3],
  ["S", "황", 16, 3],
  ["Cl", "염소", 17, 3],
  ["Ar", "아르곤", 18, 3],
] as const;
export function PeriodicRelationships() {
  const [selected, setSelected] = useState(5);
  const e = elements[selected],
    z = selected + 1,
    shells = z <= 2 ? [z] : z <= 10 ? [2, z - 2] : [2, 8, z - 10];
  return (
    <VisualFrame
      title="바깥 전자의 패턴을 읽는 지도"
      caption="처음 18개 원소의 주족 배열입니다. 전이금속 영역은 간격으로 표시했습니다. 껍질 그림은 전자 수를 나타내며 실제 전자의 원형 궤도를 뜻하지 않습니다."
    >
      <div className="periodic-layout">
        <div className="periodic-table" aria-label="원소 선택">
          {elements.map(([symbol, name, group, period], i) => (
            <button
              key={symbol}
              style={{
                gridColumn: group <= 2 ? group : group - 9,
                gridRow: period,
              }}
              aria-pressed={selected === i}
              aria-label={`${i + 1}번 ${name}`}
              onClick={() => setSelected(i)}
            >
              <small>{i + 1}</small>
              <strong>{symbol}</strong>
              <span>{name}</span>
            </button>
          ))}
        </div>
        <div className="atom-detail">
          <svg
            viewBox="0 0 240 220"
            role="img"
            aria-label={`${e[1]}의 전자껍질: ${shells.join(", ")}개`}
          >
            <circle cx="120" cy="105" r="13" fill="var(--gold)" />
            {shells.map((count, i) => (
              <g key={i}>
                <circle
                  cx="120"
                  cy="105"
                  r={32 + i * 27}
                  fill="none"
                  stroke="var(--line-strong)"
                />
                {Array.from({ length: count }, (_, j) => (
                  <circle
                    key={j}
                    cx={
                      120 + (32 + i * 27) * Math.cos((j / count) * Math.PI * 2)
                    }
                    cy={
                      105 + (32 + i * 27) * Math.sin((j / count) * Math.PI * 2)
                    }
                    r="4"
                    fill={
                      i === shells.length - 1 ? "var(--green)" : "var(--muted)"
                    }
                  />
                ))}
              </g>
            ))}
          </svg>
          <h3>
            {e[1]} <span className="mono">{e[0]}</span>
          </h3>
          <p>
            원자번호 {z} · 바깥 전자 {shells.at(-1)}개
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}
export function ScaleComparison() {
  return (
    <VisualFrame
      title="같은 노동, 달라진 에너지의 규모"
      caption="정량적인 에너지 비교가 아닌 구조 설명입니다. 연료·기계·운송이 연결되면서 생산 규모를 확대할 수 있었습니다."
    >
      <svg
        viewBox="0 0 700 280"
        role="img"
        aria-label="근력과 수력 중심의 분산 생산에서 석탄, 증기, 공장, 철도로 연결된 생산 체제로 변화"
      >
        <path d="M60 200h570" stroke="var(--line-strong)" />
        <circle
          cx="105"
          cy="114"
          r="14"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="2"
        />
        <path
          d="M105 129v42l-20 28m20-28 22 28m-22-56-24 20m24-20 22 20"
          stroke="var(--muted)"
          fill="none"
          strokeWidth="2"
        />
        <text x="105" y="238" textAnchor="middle" className="axis-label">
          근력
        </text>
        <path d="M200 153h64m-9-5 9 5-9 5" stroke="var(--muted)" fill="none" />
        <path
          d="M290 200v-62l40-24v24l40-24v24l40-24v86zM310 126V72h16v45"
          fill="var(--gold)"
          opacity=".2"
          stroke="var(--gold)"
          strokeWidth="2"
        />
        <path
          d="M318 65c-24-15 25-15 0-35"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2"
        />
        <text x="350" y="238" textAnchor="middle" className="axis-label">
          석탄 · 증기 · 공장
        </text>
        <path d="M444 153h64m-9-5 9 5-9 5" stroke="var(--muted)" fill="none" />
        <path
          d="M530 182v-57h48v57h-48m48 0v-38h38v38z"
          stroke="var(--green)"
          fill="none"
          strokeWidth="2"
        />
        <circle cx="543" cy="191" r="8" fill="var(--green)" />
        <circle cx="600" cy="191" r="8" fill="var(--green)" />
        <text x="575" y="238" textAnchor="middle" className="axis-label">
          교통 · 시장 확대
        </text>
      </svg>
    </VisualFrame>
  );
}
