export interface ReadingConnection {
  id: string;
  title: string;
  introduction: string;
  steps: {
    topic: string;
    heading: string;
    explanation: string;
    bridge?: string;
  }[];
}
export const readingConnections: ReadingConnection[] = [
  {
    id: "energy",
    title: "기계에서 확률까지",
    introduction: "왜 산업 혁명을 읽다가 확률을 만나게 될까요?",
    steps: [
      {
        topic: "industrial-revolution",
        heading: "기계가 커질수록, 에너지의 효율이 중요해진다",
        explanation:
          "공장과 증기기관은 연료의 열을 얼마나 유용한 운동으로 바꿀 수 있는지 묻게 했습니다.",
      },
      {
        topic: "entropy",
        heading: "에너지는 보존되지만, 모두 일로 바뀌지는 않는다",
        explanation:
          "열기관의 한계를 이해하려면 열이 흐르는 방향과 엔트로피를 보아야 합니다.",
        bridge: "열기관의 효율",
      },
      {
        topic: "probability",
        heading: "많은 미시적 가능성이 하나의 거시적 경향을 만든다",
        explanation:
          "확률은 퍼진 상태를 만드는 배치가 훨씬 많다는 통계적 설명을 이해하는 도구입니다.",
        bridge: "가능한 배치의 수",
      },
    ],
  },
  {
    id: "life",
    title: "원자에서 생명의 변화까지",
    introduction: "작은 원자의 성질은 어떻게 생명의 역사로 이어질까요?",
    steps: [
      {
        topic: "periodic-table",
        heading: "바깥 전자가 물질의 결합 성질을 만든다",
        explanation:
          "원소의 전자 구조는 어떤 분자를 만들 수 있는지 이해하는 출발점입니다.",
      },
      {
        topic: "dna",
        heading: "분자의 구조와 서열에 정보가 담긴다",
        explanation:
          "DNA는 화학 결합으로 이어진 분자이며 염기의 순서에 유전 정보를 저장합니다.",
        bridge: "결합에서 정보로",
      },
      {
        topic: "evolution",
        heading: "유전되는 차이가 세대의 구성을 바꾼다",
        explanation:
          "유전과 변이는 자연선택의 재료입니다. 번식 성공의 차이가 집단의 특성 비율을 바꿉니다.",
        bridge: "유전과 변이",
      },
    ],
  },
  {
    id: "motion",
    title: "움직임에서 미분까지",
    introduction: "“속도가 바뀐다”는 말을 어떻게 정확하게 표현할까요?",
    steps: [
      {
        topic: "newton-laws",
        heading: "힘은 운동의 변화를 설명한다",
        explanation:
          "뉴턴의 법칙은 힘과 가속도를 연결합니다. 가속도를 이해하려면 순간적인 변화율을 알아야 합니다.",
      },
      {
        topic: "derivative",
        heading: "미분은 바로 그 순간의 변화를 표현한다",
        explanation:
          "위치의 순간 변화율은 속도, 속도의 순간 변화율은 가속도입니다. 수학이 물리적 설명의 언어가 됩니다.",
        bridge: "순간 변화율",
      },
    ],
  },
];
