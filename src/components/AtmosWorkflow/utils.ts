// utils.ts

import * as yaml from 'js-yaml';
import { WorkflowStep } from './types';
import { CLOUDPOSSE_DOCS_URL, WORKFLOWS_DIRECTORY_PATH } from './constants';

export async function GetAtmosTerraformCommands(
  workflow: string,
  fileName: string,
  stack?: string,
  visitedWorkflows = new Set<string>()
): Promise<WorkflowStep[] | undefined> {
  try {
    const url = `${CLOUDPOSSE_DOCS_URL}${WORKFLOWS_DIRECTORY_PATH}${fileName}.yaml`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch the file:', response.statusText);
      console.error('Workflow URL:', url);
      return undefined;
    }
    const fileContent = await response.text();

    const workflows = yaml.load(fileContent) as any;

    if (workflows && workflows.workflows && workflows.workflows[workflow]) {
      const workflowDetails = workflows.workflows[workflow];

      const workflowKey = `${fileName}:${workflow}`;
      if (visitedWorkflows.has(workflowKey)) {
        console.warn(
          `Already visited workflow ${workflow} in file ${fileName}, skipping to prevent infinite loop.`
        );
        return [];
      }
      visitedWorkflows.add(workflowKey);

      let steps: WorkflowStep[] = [];

      for (const step of workflowDetails.steps) {
        let command = step.command;

        if (command.trim().startsWith('echo')) {
          const titleContent = command
            .replace(/^echo\s+/, '')
            .replace(/^['"]|['"]$/g, '')
            .trim();
          steps.push({
            type: 'title',
            content: titleContent,
          });
        } else if (command.startsWith('workflow')) {
          const commandParts = command.split(' ');
          const nestedWorkflowIndex = commandParts.findIndex((part) => part === 'workflow') + 1;
          const nestedWorkflow = commandParts[nestedWorkflowIndex];

          let nestedFileName = fileName;
          const fileFlagIndex = commandParts.findIndex((part) => part === '-f' || part === '--file');
          if (fileFlagIndex !== -1) {
            nestedFileName = commandParts[fileFlagIndex + 1];
          }

          let nestedStack = stack;
          const stackFlagIndex = commandParts.findIndex((part) => part === '-s' || part === '--stack');
          if (stackFlagIndex !== -1) {
            nestedStack = commandParts[stackFlagIndex + 1];
          }

          const nestedSteps = await GetAtmosTerraformCommands(
            nestedWorkflow,
            nestedFileName,
            nestedStack,
            visitedWorkflows
          );

          if (nestedSteps) {
            steps = steps.concat(nestedSteps);
          }
        } else if (step.type === 'shell') {
          const stepName = step.name || 'script';
          const shebang = `#!/bin/bash\n`;
          const titleComment = `# Run the ${stepName} Script\n`;
          const commandWithTitle = `${shebang}${titleComment}${command}`;
          steps.push({
            type: 'command',
            content: commandWithTitle,
          });
        } else {
          let atmosCommand = `atmos ${command}`;
          if (stack) {
            atmosCommand += ` -s ${stack}`;
          }
          steps.push({
            type: 'command',
            content: atmosCommand,
          });
        }
      }

      return steps;
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching or parsing the file:', error);
    return undefined;
  }
}
