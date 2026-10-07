/** Curated reading order, not a claim of historical causation. */
export const subjectTrails: Record<
  string,
  { question: string; topics: string[] }
> = {
  "world-history": {
    question: "권력과 사회 질서는 어떻게 바뀌었을까?",
    topics: [
      "roman-empire",
      "enlightenment",
      "french-revolution",
      "industrial-revolution",
    ],
  },
  "korean-history": {
    question: "제도와 일상의 변화로 한국사를 읽는다면?",
    topics: ["joseon", "hangul", "korean-war"],
  },
  philosophy: {
    question: "내가 안다고 믿는 것의 근거는 무엇일까?",
    topics: ["socrates", "plato-cave", "empiricism"],
  },
  physics: {
    question: "움직임, 에너지, 변화의 방향은 어떻게 연결될까?",
    topics: ["newton-laws", "energy", "entropy"],
  },
  chemistry: {
    question: "원자의 성향은 어떻게 물질의 성질이 될까?",
    topics: ["periodic-table", "chemical-bond"],
  },
  biology: {
    question: "생명은 어떻게 유지되고, 이어지고, 달라질까?",
    topics: ["cell", "dna", "evolution"],
  },
  mathematics: {
    question: "변화와 누적, 불확실성을 어떻게 표현할까?",
    topics: ["derivative", "integral", "probability"],
  },
};
