import type { Topic } from "@/lib/schema";
import { InteractiveFunction } from "./InteractiveFunction";
import { ParticleSimulation } from "./ParticleSimulation";
import { InteractiveField } from "./InteractiveField";
import { ProbabilityExperiment } from "./ProbabilityExperiment";
import {
  CausalFlow,
  CaveDiagram,
  ArgumentMap,
  ProcessDiagram,
  EvolutionTree,
  PeriodicRelationships,
  ScaleComparison,
} from "./ConceptDiagrams";
import { HistoricalTimeline, VisualFrame } from "./primitives";
export function HeroVisual({ topic }: { topic: Topic }) {
  switch (topic.visual) {
    case "derivative":
      return <InteractiveFunction />;
    case "entropy":
      return <ParticleSimulation />;
    case "newton":
      return <InteractiveField />;
    case "probability":
      return <ProbabilityExperiment />;
    case "revolution":
      return <CausalFlow />;
    case "cave":
      return <CaveDiagram />;
    case "argument":
      return <ArgumentMap />;
    case "dna":
      return <ProcessDiagram />;
    case "evolution":
      return <EvolutionTree />;
    case "periodic":
      return <PeriodicRelationships />;
    case "industry":
      return <ScaleComparison />;
    default:
      return (
        <VisualFrame
          title="전환점을 따라 전체 흐름 읽기"
          caption="사건 순서를 읽는 연표입니다. 항목 간 간격은 실제 시간 길이에 비례하지 않습니다. 같은 시간축의 비교는 전체 타임라인에서 볼 수 있습니다."
        >
          <HistoricalTimeline events={topic.timelineEvents} />
        </VisualFrame>
      );
  }
}
