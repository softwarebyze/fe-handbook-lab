import type { HandbookSection } from '@/types/content';

/** Table-of-contents style map; page hints match FE Reference Handbook 10.0.1 printing. */
export const HANDBOOK_SECTIONS: HandbookSection[] = [
  { id: 'units', title: 'Units and Conversion Factors', pageHint: 1 },
  { id: 'ethics', title: 'Ethics and Professional Practice', pageHint: 4 },
  { id: 'safety', title: 'Safety', pageHint: 13 },
  { id: 'mathematics', title: 'Mathematics', pageHint: 34 },
  { id: 'probability-stats', title: 'Engineering Probability and Statistics', pageHint: 63 },
  { id: 'chemistry-biology', title: 'Chemistry and Biology', pageHint: 85 },
  { id: 'materials', title: 'Materials Science/Structure of Matter', pageHint: 94 },
  { id: 'statics', title: 'Statics', pageHint: 107 },
  { id: 'dynamics', title: 'Dynamics', pageHint: 114 },
  { id: 'mechanics-materials', title: 'Mechanics of Materials', pageHint: 130 },
  { id: 'thermodynamics', title: 'Thermodynamics', pageHint: 143 },
  { id: 'fluid-mechanics', title: 'Fluid Mechanics', pageHint: 177 },
  { id: 'heat-transfer', title: 'Heat Transfer', pageHint: 204 },
  { id: 'instrumentation-control', title: 'Instrumentation, Measurement, and Control', pageHint: 220 },
  { id: 'economics', title: 'Engineering Economics', pageHint: 230 },
  { id: 'chemical-engineering', title: 'Chemical Engineering', pageHint: 238 },
  { id: 'civil-engineering', title: 'Civil Engineering', pageHint: 259 },
  { id: 'environmental-engineering', title: 'Environmental Engineering', pageHint: 310 },
  { id: 'electrical-computer', title: 'Electrical and Computer Engineering', pageHint: 355 },
  { id: 'industrial-systems', title: 'Industrial and Systems Engineering', pageHint: 417 },
  { id: 'mechanical-engineering', title: 'Mechanical Engineering', pageHint: 431 },
];

export const NCEES_HANDBOOK_URL =
  'https://ncees.org/exams/exam-preparation-materials/';

export function getSectionById(id: string) {
  return HANDBOOK_SECTIONS.find((s) => s.id === id);
}
