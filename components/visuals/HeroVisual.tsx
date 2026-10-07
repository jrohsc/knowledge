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
import { ConceptSketch } from "./ConceptSketch";
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
      return <ConceptSketch topic={topic.id} hero />;
  }
}
