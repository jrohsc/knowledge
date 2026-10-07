"use client";
import { useState } from "react";
import Link from "next/link";
import { scaleLinear } from "d3-scale";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import {
  timelineBands,
  regions,
  yearLabel,
  type TimelineBand,
} from "@/content/timeline";
const presets = [
  { name: "전체", start: -3000, end: 2026 },
  { name: "고대", start: -700, end: 500 },
  { name: "중세", start: 500, end: 1500 },
  { name: "근세", start: 1400, end: 1850 },
  { name: "근현대", start: 1800, end: 2026 },
];
export function ParallelTimeline({
  initialYear = -300,
}: {
  initialYear?: number;
}) {
  const [range, setRange] = useState<[number, number]>([-700, 500]),
    [year, setYear] = useState(initialYear),
    [filter, setFilter] = useState("전체"),
    [selected, setSelected] = useState<TimelineBand | null>(null);
  const visibleRegions =
    filter === "전체"
      ? regions
      : filter === "세계사"
        ? regions.filter((r) => !["한국", "과학", "철학"].includes(r))
        : filter === "한국사"
          ? ["한국"]
          : [filter];
  const shown = timelineBands.filter(
    (b) =>
      visibleRegions.includes(b.region) &&
      b.end >= range[0] &&
      b.start <= range[1],
  );
  const x = scaleLinear().domain(range).range([140, 1150]);
  let offset = 55;
  const layout = visibleRegions.map((region) => {
    const bands = shown
      .filter((b) => b.region === region)
      .sort((a, b) => a.start - b.start);
    const laneEnds: number[] = [];
    const placed = bands.map((b) => {
      let lane = laneEnds.findIndex((end) => end <= b.start);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = b.end;
      return { ...b, lane };
    });
    const top = offset;
    heightAdjust();
    function heightAdjust() {
      offset += Math.max(1, laneEnds.length) * 40 + 30;
    }
    return { region, top, bands: placed };
  });
  const height = offset + 25;
  const atYear = timelineBands.filter(
    (b) =>
      visibleRegions.includes(b.region) &&
      b.start <= year &&
      (b.end > year || (b.end === 2026 && year === 2026)),
  );
  function changeRange(start: number, end: number) {
    const span = Math.min(5026, Math.max(40, end - start));
    start = Math.max(-3000, Math.min(2026 - span, start));
    end = start + span;
    setRange([Math.round(start), Math.round(end)]);
    setYear((y) => Math.max(Math.round(start), Math.min(Math.round(end), y)));
    setSelected(null);
  }
  return (
    <>
      <div className="timeline-toolbar">
        <div className="segmented">
          {presets.map((p) => (
            <button
              key={p.name}
              aria-pressed={range[0] === p.start && range[1] === p.end}
              onClick={() => changeRange(p.start, p.end)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="timeline-zoom">
          <button
            className="icon-button"
            aria-label="이전 시기"
            onClick={() =>
              changeRange(
                range[0] - (range[1] - range[0]) * 0.4,
                range[1] - (range[1] - range[0]) * 0.4,
              )
            }
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="타임라인 축소"
            onClick={() =>
              changeRange(
                year - (range[1] - range[0]),
                year + (range[1] - range[0]),
              )
            }
          >
            <Minus size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="타임라인 확대"
            onClick={() =>
              changeRange(
                year - (range[1] - range[0]) * 0.3,
                year + (range[1] - range[0]) * 0.3,
              )
            }
          >
            <Plus size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="다음 시기"
            onClick={() =>
              changeRange(
                range[0] + (range[1] - range[0]) * 0.4,
                range[1] + (range[1] - range[0]) * 0.4,
              )
            }
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="timeline-filters">
        <label htmlFor="region-filter">비교할 지역</label>
        <select
          id="region-filter"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setSelected(null);
          }}
        >
          {[
            "전체",
            "세계사",
            "한국사",
            ...regions.filter((r) => r !== "한국"),
          ].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <span>막대를 선택하면 맥락을 볼 수 있습니다.</span>
      </div>
      <figure className="parallel-timeline">
        <div
          className="timeline-scroll"
          tabIndex={0}
          role="region"
          aria-label="평행 타임라인. 작은 화면에서는 가로로 스크롤할 수 있습니다."
        >
          <svg
            viewBox={`0 0 1200 ${height}`}
            style={{ minWidth: 950 }}
            role="group"
            aria-label={`${yearLabel(range[0])}부터 ${yearLabel(range[1])}까지 지역별 평행 연표`}
          >
            {x.ticks(8).map((t) => (
              <g key={t}>
                <line
                  x1={x(t)}
                  x2={x(t)}
                  y1="38"
                  y2={height - 15}
                  stroke="var(--line)"
                />
                <text
                  x={x(t)}
                  y="23"
                  textAnchor="middle"
                  className="axis-label"
                >
                  {t < 0 ? `기원전 ${-t}` : t === 0 ? "서기 1" : t}
                </text>
              </g>
            ))}
            {layout.map((row) => (
              <g key={row.region}>
                <text x="15" y={row.top + 20} className="diagram-label">
                  {row.region}
                </text>
                {row.bands.map((b) => {
                  const left = x(Math.max(range[0], b.start)),
                    width = Math.max(3, x(Math.min(range[1], b.end)) - left);
                  return (
                    <g
                      key={b.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${b.region} ${b.label}: ${yearLabel(b.start)}에서 ${yearLabel(b.end)}`}
                      onClick={() => setSelected(b)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(b);
                        }
                      }}
                      className="timeline-band"
                    >
                      <title>
                        {b.label} · {yearLabel(b.start)}–{yearLabel(b.end)}
                      </title>
                      <rect
                        x={left}
                        y={row.top + b.lane * 40}
                        width={width}
                        height="28"
                        fill={b.color}
                        opacity={selected?.id === b.id ? ".65" : ".24"}
                      />
                      <rect
                        x={left}
                        y={row.top + b.lane * 40}
                        width="2"
                        height="28"
                        fill={b.color}
                      />
                      {width > 40 && (
                        <text
                          x={left + 7}
                          y={row.top + b.lane * 40 + 19}
                          className="band-label"
                        >
                          {b.label.length * 12 > width - 15
                            ? b.label.slice(
                                0,
                                Math.max(1, Math.floor((width - 24) / 12)),
                              ) + "…"
                            : b.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
            <line
              x1={x(year)}
              x2={x(year)}
              y1="35"
              y2={height - 15}
              stroke="var(--ink)"
              strokeDasharray="3 4"
            />
            <path d={`M${x(year) - 5} 31h10l-5 7z`} fill="var(--ink)" />
          </svg>
        </div>
        <figcaption>
          시간의 길이는 같은 축척입니다. 겹치는 막대는 공존한 체제 또는 시대
          구분입니다. 고대의 일부 경계와 시대 구분은 근사치이며, 빈 구간은
          역사가 없다는 뜻이 아닙니다.
        </figcaption>
      </figure>
      <div className="year-scrubber">
        <label htmlFor="timeline-year">
          같은 순간을 비교하기 <strong>{yearLabel(year)}</strong>
        </label>
        <input
          id="timeline-year"
          type="range"
          min={range[0]}
          max={range[1]}
          value={year}
          onChange={(e) => setYear(+e.target.value)}
        />
        <div>
          <span>{yearLabel(range[0])}</span>
          <span>{yearLabel(range[1])}</span>
        </div>
      </div>
      {selected && (
        <aside className="timeline-detail">
          <span className="eyebrow">
            {selected.region} · {yearLabel(selected.start)}–
            {yearLabel(selected.end)}
          </span>
          <h2>{selected.label}</h2>
          <p>{selected.description}</p>
          {selected.topic && (
            <Link className="inline-link" href={`/topic/${selected.topic}/`}>
              연결된 글 읽기 <ArrowUpRight size={17} />
            </Link>
          )}
        </aside>
      )}
      <section className="simultaneous">
        <div className="section-heading">
          <h2>{yearLabel(year)}, 다른 곳에서는</h2>
          <span>{atYear.length}개의 흐름</span>
        </div>
        <div className="simultaneous-grid">
          {atYear.length ? (
            atYear.map((b) => (
              <button key={b.id} onClick={() => setSelected(b)}>
                <span className="subject-label" style={{ color: b.color }}>
                  {b.region}
                </span>
                <h3>{b.label}</h3>
                <p>{b.description}</p>
              </button>
            ))
          ) : (
            <p className="empty">
              선택한 연도에 등록된 구간이 없습니다. 다른 시기나 지역을
              선택해보세요.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
