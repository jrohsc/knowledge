import type { ReactNode } from "react";
/** Small original line drawings; proportions and motifs are shared, not article semantics. */
function Person({
  x,
  y,
  pose = "open",
  scale = 1,
}: {
  x: number;
  y: number;
  pose?: "open" | "think" | "carry" | "push" | "walk";
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cy="0" r="9" fill="var(--paper)" />
      <path d="M0 10v31m0 0-13 25m13-25 15 25" />
      {pose === "think" ? (
        <path d="M0 19l15 10 5-23M0 19l-17 18" />
      ) : pose === "push" ? (
        <path d="M0 18l22 6h12M0 20l20 14h14" />
      ) : pose === "carry" ? (
        <path d="M0 19l-15 18 25-2M0 19l18 10" />
      ) : pose === "walk" ? (
        <path d="M0 18l-17-5M0 18l18 16" />
      ) : (
        <path d="M0 19l-19 15M0 19l20-14" />
      )}
      <circle cx="3" cy="-1" r="1" fill="currentColor" stroke="none" />
    </g>
  );
}
function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = "var(--green)",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g stroke={color}>
      <path d={`M${x1} ${y1}L${x2} ${y2}`} />
      <path
        d={`M${x2 - 8 * Math.cos(a - 0.5)} ${y2 - 8 * Math.sin(a - 0.5)}L${x2} ${y2}L${x2 - 8 * Math.cos(a + 0.5)} ${y2 - 8 * Math.sin(a + 0.5)}`}
      />
    </g>
  );
}
function Book({ x = 85, y = 68 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0 0Q22-8 43 3Q64-8 86 0v51q-24-8-43 1Q20 44 0 51Z"
        fill="var(--paper)"
      />
      <path
        d="M43 3v49M10 12l22 2M10 24l22 2M54 14l21-2M54 26l21-2"
        stroke="var(--green)"
      />
    </g>
  );
}
function Building({
  x,
  y = 100,
  scale = 1,
}: {
  x: number;
  y?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-28 0 0-17 28 0ZM-23 5v30m15-30v30M8 5v30M23 5v30M-29 38h58" />
    </g>
  );
}
function Cart({
  x,
  y = 106,
  loaded = false,
}: {
  x: number;
  y?: number;
  loaded?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0h52v21H0Z" fill="var(--paper)" />
      <circle cx="10" cy="28" r="6" />
      <circle cx="42" cy="28" r="6" />
      {loaded && (
        <>
          <path d="M8-23h34V0H8Z" fill="var(--surface-strong)" />
          <path d="M18-23v23M32-23v23" opacity=".3" />
        </>
      )}
    </g>
  );
}
function Bubble({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M-22-19h44q9 0 9 9v17q0 9-9 9H1l-12 12 2-12h-13q-9 0-9-9v-17q0-9 9-9Z"
        fill="var(--paper)"
        stroke="var(--line-strong)"
      />
      <text
        textAnchor="middle"
        y="5"
        fill="var(--green)"
        stroke="none"
        fontSize="23"
        fontFamily="var(--serif)"
      >
        {text}
      </text>
    </g>
  );
}
function Beetle({ x, y, brown }: { x: number; y: number; brown: boolean }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={brown ? "var(--gold)" : "var(--green)"}
    >
      <path d="M-7-4l-6-5m6 13-6 5M7-4l6-5m-6 13 6 5" />
      <ellipse
        rx="7"
        ry="10"
        fill={brown ? "var(--gold)" : "var(--green)"}
        fillOpacity=".2"
      />
      <path d="M0-9v18" />
    </g>
  );
}
function Ground() {
  return <path d="M22 146q48-2 89 0t127-1" stroke="var(--line-strong)" />;
}
function Scene({ topic, stage }: { topic: string; stage: number }): ReactNode {
  switch (topic) {
    case "french-revolution":
      return stage === 0 ? (
        <>
          <Person x={63} y={79} pose="carry" />
          <path
            d="M55 86l20-24 24 13-8 22Z"
            fill="var(--gold)"
            fillOpacity=".15"
          />
          <Building x={192} y={67} />
          <path d="M165 113h55" />
          <Arrow x1={101} y1={77} x2={151} y2={66} />
          <Ground />
        </>
      ) : stage === 1 ? (
        <>
          <Person x={55} y={79} />
          <Person x={115} y={79} pose="think" />
          <Person x={205} y={79} />
          <Bubble x={118} y={38} text="누가?" />
          <Ground />
        </>
      ) : (
        <>
          <path d="M130 39v83M78 126h104M69 60h122m-100 0-23 36h46Zm78 0-23 36h46Z" />
          <circle cx="130" cy="39" r="5" fill="var(--green)" />
          <Person x={39} y={99} scale={0.62} />
          <Person x={221} y={99} scale={0.62} />
        </>
      );
    case "roman-empire":
      return stage === 0 ? (
        <>
          <Building x={130} y={52} scale={0.75} />
          <Building x={47} y={107} scale={0.6} />
          <Building x={217} y={107} scale={0.6} />
          <path
            d="M113 85 60 103m88-18 56 18M72 133h117"
            stroke="var(--gold)"
            strokeDasharray="4 5"
          />
          <circle cx="130" cy="107" r="5" fill="var(--green)" />
          <path d="M130 88v13M78 116l47-7m10 0 44 8" />
        </>
      ) : stage === 1 ? (
        <>
          <Book />
          <Person x={38} y={85} scale={0.8} />
          <Person x={223} y={85} scale={0.8} />
          <path
            d="M69 75Q130 9 195 75"
            stroke="var(--green)"
            strokeDasharray="3 5"
          />
        </>
      ) : (
        <>
          <Building x={194} y={68} />
          <Person x={60} y={76} pose="carry" />
          <path d="M58 94h24v21H58Z" fill="var(--gold)" fillOpacity=".2" />
          <Arrow x1={95} y1={101} x2={155} y2={101} />
          <path d="M161 124h60m-16-7v-5m-24 5v-5" />
          <Ground />
        </>
      );
    case "industrial-revolution":
      return stage === 0 ? (
        <>
          <Person x={74} y={61} pose="push" />
          <path d="M107 85h85M119 85v60m62-60v60M110 107h80" />
          <circle cx="164" cy="59" r="23" />
          <path
            d="M164 36v46m-23-23h46m-39-16 32 32m0-32-32 32"
            stroke="var(--green)"
          />
          <Ground />
        </>
      ) : stage === 1 ? (
        <>
          <path
            d="M69 62h64v75H69ZM79 62V37h19v25M82 34q-21-15 0-24M80 105h42v22H80Z"
            fill="var(--surface)"
          />
          <path d="M84 118l8-13 5 12 10-15 9 16" stroke="var(--gold)" />
          <circle cx="195" cy="101" r="30" />
          <circle cx="195" cy="101" r="7" />
          <path d="M133 82h62v12m-36 36 16-10" stroke="var(--green)" />
          <Ground />
        </>
      ) : (
        <>
          <path d="M41 60h179M41 118h179" stroke="var(--line-strong)" />
          {[60, 130, 200].map((x) => (
            <g key={x}>
              <Person x={x} y={65} scale={0.75} />
              <path d={`M${x - 15} 118h30v15h-30Z`} />
            </g>
          ))}
          <circle cx="130" cy="29" r="16" />
          <path d="M130 18v12l8 5" stroke="var(--gold)" />
          <Ground />
        </>
      );
    case "joseon":
      return stage === 0 ? (
        <>
          <Book y={66} />
          <path d="M98 46h60M116 34h24" stroke="var(--green)" />
          <Person x={37} y={89} scale={0.75} pose="think" />
          <Person x={221} y={89} scale={0.75} />
        </>
      ) : stage === 1 ? (
        <>
          <Building x={130} y={42} />
          <Person x={52} y={79} />
          <Person x={207} y={79} pose="think" />
          <path d="M87 91h88v7H87ZM99 98v43m65-43v43" />
          <Arrow x1={81} y1={66} x2={111} y2={62} />
          <Arrow x1={179} y1={66} x2={149} y2={62} />
          <Ground />
        </>
      ) : (
        <>
          <Book />
          <text
            x="129"
            y="38"
            textAnchor="middle"
            stroke="none"
            fill="var(--green)"
            fontSize="28"
          >
            가 나 다
          </text>
          <Person x={38} y={95} scale={0.62} />
          <Person x={222} y={95} scale={0.62} />
          <path
            d="M38 62q12-26 42-29m102 0q29 5 40 29"
            stroke="var(--gold)"
            strokeDasharray="3 5"
          />
        </>
      );
    case "korean-war":
      return stage === 0 ? (
        <>
          <path
            d="M139 17l23 17-10 25 13 19-17 18-1 24-26 28-18-15 12-24-10-18 13-18-2-29Z"
            fill="var(--surface-strong)"
          />
          <path d="M66 83h125" stroke="var(--gold)" strokeDasharray="5 5" />
          <Person x={46} y={55} scale={0.7} />
          <Person x={212} y={91} scale={0.7} />
        </>
      ) : stage === 1 ? (
        <>
          <Person x={69} y={66} pose="carry" />
          <Person x={129} y={91} pose="walk" scale={0.65} />
          <path d="M56 85h27v23H56Z" fill="var(--surface-strong)" />
          <path
            d="M186 86v-30l22-17 24 17v30m-37 0V65h16v21"
            stroke="var(--muted)"
          />
          <Arrow x1={111} y1={47} x2={43} y2={47} />
          <Ground />
        </>
      ) : (
        <>
          <Person x={61} y={77} />
          <Person x={199} y={77} pose="think" />
          <path
            d="M125 28v119m10-119v119M116 51h28m-28 25h28m-28 25h28m-28 25h28"
            stroke="var(--gold)"
          />
          <path
            d="M86 61q19-22 36-23m17 0q17 1 34 23"
            strokeDasharray="3 5"
            stroke="var(--line-strong)"
          />
          <Ground />
        </>
      );
    case "socrates":
      return stage === 0 ? (
        <>
          <Person x={66} y={76} />
          <Person x={194} y={76} pose="think" />
          <Bubble x={78} y={29} text="알아!" />
          <Ground />
        </>
      ) : stage === 1 ? (
        <>
          <Person x={77} y={70} pose="think" />
          <Person x={186} y={89} scale={0.75} />
          <Bubble x={150} y={30} text="정말?" />
          <path d="M126 144l12-24 17 24m-16-15 8 2" stroke="var(--gold)" />
          <Ground />
        </>
      ) : (
        <>
          <Person x={72} y={77} pose="think" />
          <Person x={188} y={77} />
          <Bubble x={128} y={27} text="왜?" />
          <path d="M102 106h56" stroke="var(--green)" strokeDasharray="4 4" />
          <Ground />
        </>
      );
    case "plato-cave":
      return stage === 0 ? (
        <>
          <path d="M24 145V37q56-26 98-8t62 8" stroke="var(--line-strong)" />
          <Person x={94} y={87} scale={0.72} />
          <path d="M49 63v65m0-46 18 14m-18 13 16 19" stroke="var(--muted)" />
          <path
            d="M213 124l-12-27-5 14-13-37-12 50Z"
            fill="var(--gold)"
            fillOpacity=".2"
          />
          <path
            d="M190 94 47 45v85Z"
            fill="var(--gold)"
            fillOpacity=".09"
            stroke="none"
          />
          <Ground />
        </>
      ) : stage === 1 ? (
        <>
          <Person x={82} y={77} pose="think" />
          <path d="M132 118V74l17-22 17 22v44" fill="var(--surface-strong)" />
          <path
            d="M221 119l-14-33-7 15-12-30-10 48Z"
            fill="var(--gold)"
            fillOpacity=".2"
          />
          <Arrow x1={99} y1={51} x2={146} y2={35} />
          <Ground />
        </>
      ) : (
        <>
          <circle
            cx="190"
            cy="37"
            r="19"
            fill="var(--gold)"
            fillOpacity=".18"
          />
          <Person x={70} y={77} />
          <Person x={160} y={77} pose="think" />
          <Arrow x1={169} y1={36} x2={101} y2={36} />
          <path d="M34 145V46q15-10 32-4" stroke="var(--line-strong)" />
          <Ground />
        </>
      );
    case "newton-laws":
      return stage === 0 ? (
        <>
          <Cart x={77} />
          <path d="M40 114h25m-32 13h27" stroke="var(--line-strong)" />
          <Arrow x1={97} y1={76} x2={175} y2={76} />
          <Ground />
        </>
      ) : stage === 1 ? (
        <>
          <Person x={52} y={73} pose="push" />
          <Cart x={94} loaded />
          <Arrow x1={171} y1={111} x2={227} y2={111} />
          <Ground />
        </>
      ) : (
        <>
          <Person x={94} y={62} pose="push" />
          <g transform="translate(274 0) scale(-1 1)">
            <Person x={94} y={62} pose="push" />
          </g>
          <path d="M67 136h47m42 0h47" />
          <Arrow x1={87} y1={35} x2={42} y2={35} />
          <Arrow x1={186} y1={35} x2={231} y2={35} />
          <Ground />
        </>
      );
    case "entropy":
      return (
        <>
          <path d="M36 36h188v100H36Z" />
          {stage === 0 && <path d="M102 36v100" stroke="var(--gold)" />}
          {Array.from({ length: 24 }, (_, i) => {
            const x =
              stage === 0
                ? 49 + (i % 4) * 14
                : stage === 1
                  ? 48 + ((i * 37) % 136)
                  : 47 + ((i * 59) % 166);
            const y = 49 + ((i * 23) % 75);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                stroke="none"
                fill={i % 3 ? "var(--green)" : "var(--gold)"}
              />
            );
          })}
          {stage === 1 && <Arrow x1={109} y1={20} x2={154} y2={20} />}
        </>
      );
    case "evolution":
      return (
        <>
          {stage > 0 && (
            <path
              d="M24 53q95-27 213 0v84H24Z"
              fill="var(--gold)"
              fillOpacity=".09"
              stroke="none"
            />
          )}
          {Array.from({ length: 9 }, (_, i) => (
            <Beetle
              key={i}
              x={60 + (i % 3) * 68}
              y={51 + Math.floor(i / 3) * 37}
              brown={stage === 2 ? i !== 7 : i % 2 === 0}
            />
          ))}
          {stage === 1 && (
            <path d="M159 18l13 14 18-12-7 23-23-8" stroke="var(--muted)" />
          )}
        </>
      );
    case "dna":
      return stage === 0 ? (
        <>
          <Book />
          <text
            x="130"
            y="39"
            textAnchor="middle"
            stroke="none"
            fill="var(--green)"
            fontSize="20"
            fontFamily="monospace"
          >
            A · T · G · C
          </text>
        </>
      ) : stage === 1 ? (
        <>
          <Book x={25} y={50} />
          <Arrow x1={127} y1={80} x2={163} y2={80} />
          <path d="M184 43h43v82h-43Z" fill="var(--paper)" />
          <path
            d="M193 62h23m-23 15h23m-23 15h23m-23 15h15"
            stroke="var(--green)"
          />
        </>
      ) : (
        <>
          <path d="M34 104h186" stroke="var(--green)" />
          <ellipse
            cx="135"
            cy="99"
            rx="32"
            ry="24"
            fill="var(--surface-strong)"
          />
          <path d="M128 77q-30-20-9-28t22-25" stroke="var(--gold)" />
          {[0, 1, 2, 3, 4].map((v) => (
            <circle
              key={v}
              cx={118 + Math.sin(v) * 12}
              cy={71 - v * 10}
              r="4"
              fill="var(--gold)"
            />
          ))}
          <path d="M118 104h37" stroke="var(--green)" />
        </>
      );
    case "periodic-table":
      return stage === 2 ? (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${i * 43})`}>
              <rect
                x="66"
                y="17"
                width="45"
                height="33"
                fill="var(--surface-strong)"
              />
              <text
                x="88"
                y="40"
                textAnchor="middle"
                fontSize="19"
                stroke="none"
                fill="var(--ink)"
              >
                {["Li", "Na", "K"][i]}
              </text>
              <circle cx="174" cy="33" r="14" stroke="var(--line-strong)" />
              <circle cx="188" cy="33" r="4" fill="var(--green)" />
            </g>
          ))}
        </>
      ) : (
        <>
          <circle
            cx="130"
            cy="84"
            r="11"
            fill="var(--gold)"
            fillOpacity=".25"
          />
          <text
            x="130"
            y="90"
            textAnchor="middle"
            stroke="none"
            fill="var(--ink)"
            fontSize="14"
          >
            {stage === 0 ? "1+" : "3+"}
          </text>
          <circle cx="130" cy="84" r="39" stroke="var(--line-strong)" />
          {Array.from({ length: stage === 0 ? 1 : 2 }, (_, i) => (
            <circle
              key={i}
              cx={130 + 39 * Math.cos(i * Math.PI)}
              cy={84 + 39 * Math.sin(i * Math.PI)}
              r="4"
              fill="var(--green)"
            />
          ))}
          {stage === 1 && (
            <>
              <circle cx="130" cy="84" r="63" stroke="var(--line-strong)" />
              <circle cx="193" cy="84" r="5" fill="var(--green)" />
              <Arrow x1={226} y1={41} x2={200} y2={70} />
            </>
          )}
        </>
      );
    case "derivative": {
      const point = (t: number) => ({
        x: 40 + 210 * t - 28 * t * t,
        y: 129 - 16 * t - 91 * t * t,
      });
      const a = point(0.3),
        b = point(stage === 0 ? 0.9 : stage === 1 ? 0.5 : 0.32);
      const slope =
        stage === 2
          ? (-16 - 182 * 0.3) / (210 - 56 * 0.3)
          : (b.y - a.y) / (b.x - a.x);
      const left = stage === 2 ? 65 : a.x - 20,
        right = stage === 2 ? 190 : b.x + 14;
      return (
        <>
          <path d="M35 22v118h190" stroke="var(--line-strong)" />
          <path d="M40 129Q145 121 222 22" />
          <circle cx={a.x} cy={a.y} r="4" fill="var(--green)" />
          {stage < 2 && <circle cx={b.x} cy={b.y} r="4" fill="var(--green)" />}
          {stage < 2 && (
            <path
              d={`M${a.x} ${a.y}H${b.x}V${b.y}`}
              stroke="var(--line-strong)"
              strokeDasharray="3 4"
            />
          )}
          <path
            d={`M${left} ${a.y + slope * (left - a.x)}L${right} ${a.y + slope * (right - a.x)}`}
            stroke="var(--green)"
          />
          <text
            x={a.x - 14}
            y={a.y - 11}
            stroke="none"
            fill="var(--ink)"
            fontSize="17"
          >
            A
          </text>
          {stage < 2 && (
            <text
              x={b.x + 7}
              y={b.y - 8}
              stroke="none"
              fill="var(--green)"
              fontSize="17"
            >
              B
            </text>
          )}
        </>
      );
    }
    case "probability":
      return stage === 0 ? (
        <>
          <Person x={69} y={78} />
          <circle
            cx="148"
            cy="58"
            r="19"
            fill="var(--gold)"
            fillOpacity=".14"
          />
          <text
            x="148"
            y="65"
            textAnchor="middle"
            stroke="none"
            fill="var(--ink)"
            fontSize="21"
          >
            ?
          </text>
          <path d="M105 89q12-13 22-14" strokeDasharray="3 4" />
          <Ground />
        </>
      ) : stage === 1 ? (
        <>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle
                cx={44 + i * 56}
                cy="94"
                r="20"
                fill="var(--gold)"
                fillOpacity=".13"
              />
              <text
                x={44 + i * 56}
                y="100"
                textAnchor="middle"
                stroke="none"
                fill="var(--ink)"
                fontSize="18"
              >
                {i < 3 ? "앞" : "?"}
              </text>
            </g>
          ))}
          <path d="M172 36q19-17 38 0" stroke="var(--green)" />
          <text
            x="192"
            y="60"
            textAnchor="middle"
            stroke="none"
            fill="var(--green)"
            fontSize="18"
          >
            ½
          </text>
        </>
      ) : (
        <>
          {Array.from({ length: 20 }, (_, i) => (
            <g key={i}>
              <circle
                cx={38 + (i % 5) * 45}
                cy={30 + Math.floor(i / 5) * 34}
                r="12"
                fill={(i * 7) % 20 < 11 ? "var(--gold)" : "var(--green)"}
                fillOpacity=".16"
              />
              <path
                d={
                  (i * 7) % 20 < 11
                    ? `M${34 + (i % 5) * 45} ${30 + Math.floor(i / 5) * 34}h8`
                    : `M${38 + (i % 5) * 45} ${26 + Math.floor(i / 5) * 34}v8`
                }
                stroke={(i * 7) % 20 < 11 ? "var(--gold)" : "var(--green)"}
              />
            </g>
          ))}
        </>
      );
    default:
      return <Book />;
  }
}
export function SketchDrawing({
  topic,
  stage = 0,
  label,
}: {
  topic: string;
  stage?: number;
  label?: string;
}) {
  return (
    <svg
      className="concept-drawing"
      viewBox="0 0 260 164"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      fill="none"
      stroke="var(--ink)"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Scene topic={topic} stage={stage} />
    </svg>
  );
}
