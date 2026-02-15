export interface SectionProps {
  id: string;
  className?: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface IdeaSeparation {
  coreArgument: string;
  distinctPoints: string[];
  noiseReduction: string[];
  rigorScore: number; // 0 to 100
  constructiveCritique: string;
  groundingSources?: GroundingSource[];
}

export interface NavItem {
  label: string;
  href: string;
}