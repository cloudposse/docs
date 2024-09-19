// types.ts

export interface WorkflowStep {
  type: 'command' | 'title';
  content: string;
}

export interface WorkflowData {
  description?: string;
  steps: WorkflowStep[];
}
