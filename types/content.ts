/** Content model: original study material keyed to handbook section names (not NCEES text). */

export type HandbookSectionId =
  | 'units'
  | 'ethics'
  | 'safety'
  | 'mathematics'
  | 'probability-stats'
  | 'chemistry-biology'
  | 'materials'
  | 'statics'
  | 'dynamics'
  | 'mechanics-materials'
  | 'thermodynamics'
  | 'fluid-mechanics'
  | 'heat-transfer'
  | 'instrumentation-control'
  | 'economics'
  | 'chemical-engineering'
  | 'civil-engineering'
  | 'environmental-engineering'
  | 'electrical-computer'
  | 'industrial-systems'
  | 'mechanical-engineering';

export interface HandbookSection {
  id: HandbookSectionId;
  title: string;
  /** Approximate page in FE Reference Handbook 10.0.1 (user’s PDF may differ slightly). */
  pageHint: number;
}

export interface FormulaVariable {
  symbol: string;
  name: string;
  units?: string;
}

export interface FormulaCard {
  id: string;
  topicId: string;
  title: string;
  /** Plain text fallback for search / accessibility. */
  expression: string;
  /** KaTeX math string (use \\ for backslash). Rendered when present. */
  latex?: string;
  variables: FormulaVariable[];
  handbookSection: string;
}

export interface QuizItem {
  id: string;
  topicId: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

/** Structured lesson: interactive, visual math, callouts. */
export type LessonBlock =
  | { type: 'lead'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'math'; latex: string; caption?: string }
  | { type: 'bullet'; items: string[] }
  | {
      type: 'callout';
      variant: 'insight' | 'exam' | 'lab';
      title: string;
      body: string;
      /** Navigate to simulator id when variant is lab */
      simId?: string;
    }
  | { type: 'checkpoint'; title: string; body: string }
  | { type: 'divider' };

export interface Topic {
  id: string;
  sectionId: HandbookSectionId;
  title: string;
  /** Verbatim section name from handbook TOC for user cross-reference. */
  handbookSection: string;
  pageHint?: number;
  learningObjectives: string[];
  /** Legacy plain lesson; used when `lessonBlocks` is absent. */
  lesson: string;
  /** Rich lesson with KaTeX and callouts (preferred when provided). */
  lessonBlocks?: LessonBlock[];
  formulaCardIds: string[];
  quizItemIds: string[];
  simulatorIds: string[];
}

export interface SimulatorMeta {
  id: string;
  title: string;
  description: string;
  sectionIds: HandbookSectionId[];
}
