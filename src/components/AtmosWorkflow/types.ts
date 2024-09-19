// types.ts

export interface WorkflowStep {
  type: 'command' | 'title';
  content: string;
}
