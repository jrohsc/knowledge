import type { Relationship } from "@/lib/schema";
export const relationships: Relationship[] = [
  {
    from: "socrates",
    to: "plato-cave",
    label: "정의와 앎을 묻는 대화에서 교육과 실재의 문제로",
    type: "확장",
  },
  {
    from: "plato-cave",
    to: "newton-laws",
    label: "겉모습을 넘어 설명을 찾기 — 서로 다른 탐구 방법",
    type: "대조",
  },
  {
    from: "newton-laws",
    to: "derivative",
    label: "속도와 가속도를 순간 변화율로 표현",
    type: "도구",
  },
  {
    from: "newton-laws",
    to: "industrial-revolution",
    label: "기계의 운동을 해석하는 이론적 도구",
    type: "도구",
  },
  {
    from: "industrial-revolution",
    to: "entropy",
    label: "열기관의 효율 문제에서 열역학으로",
    type: "배경",
  },
  {
    from: "probability",
    to: "entropy",
    label: "가능한 미시상태의 수로 거시적 경향 설명",
    type: "도구",
  },
  {
    from: "probability",
    to: "evolution",
    label: "선택과 우연에 의한 빈도 변화를 구별",
    type: "도구",
  },
  {
    from: "periodic-table",
    to: "dna",
    label: "원자의 결합 성질에서 생체 분자의 구조로",
    type: "배경",
  },
  {
    from: "dna",
    to: "evolution",
    label: "유전과 변이가 자연선택의 재료를 제공",
    type: "배경",
  },
  {
    from: "entropy",
    to: "evolution",
    label: "열린 계의 질서 형성은 제2법칙과 양립",
    type: "확장",
  },
  {
    from: "roman-empire",
    to: "french-revolution",
    label: "공화정과 시민권의 의미를 시대별로 비교",
    type: "대조",
  },
  {
    from: "french-revolution",
    to: "industrial-revolution",
    label: "정치 질서와 생산 질서가 함께 바뀐 시대",
    type: "배경",
  },
  {
    from: "joseon",
    to: "korean-war",
    label: "왕조 이후 제국·식민지·분단으로 이어진 단절과 변화",
    type: "배경",
  },
  {
    from: "joseon",
    to: "french-revolution",
    label: "18세기 말 서로 다른 정치 질서를 비교",
    type: "대조",
  },
];
