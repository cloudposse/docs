// utils.ts

import * as yaml from 'js-yaml';
import { WorkflowStep, WorkflowData } from './types';
import { CLOUDPOSSE_DOCS_URL, WORKFLOWS_DIRECTORY_PATH } from './constants';

export async function GetAtmosTerraformCommands(
  workflow: string,
  fileName: string,
  stack?: string,
  visitedWorkflows = new Set<string>()
): Promise<WorkflowData | undefined> {
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
        return { description: workflowDetails.description, steps: [] };
      }
      visitedWorkflows.add(workflowKey);

      let steps: WorkflowStep[] = [];
      let currentGroupCommands: string[] = [];
      let currentTitle: string | null = null;

      const addGroupToSteps = () => {
        if (currentGroupCommands.length > 0) {
          if (currentTitle) {
            steps.push({
              type: 'title',
              content: `${currentTitle}\n\n${currentGroupCommands.join('\n')}`
            });
          } else {
            steps.push({
              type: 'command',
              content: currentGroupCommands.join('\n')
            });
          }
          currentGroupCommands = [];
          currentTitle = null;
        }
      };

      // Group all vendor pull commands together
      const isVendorWorkflow = workflowDetails.steps.every(step => 
        step.command.startsWith('vendor pull')
      );

      for (const step of workflowDetails.steps) {
        let command = step.command;

        if (isVendorWorkflow) {
          // Add all vendor commands to a single group
          let atmosCommand = `atmos ${command}`;
          if (stack) {
            atmosCommand += ` -s ${stack}`;
          }
          currentGroupCommands.push(atmosCommand);
        } else if (command.trim().startsWith('echo') && step.type === 'shell') {
          // When we find an echo, add previous group and start new group
          addGroupToSteps();
          currentTitle = command.replace(/^echo\s+['"](.+)['"]$/, '$1');
        } else if (command.startsWith('workflow')) {
          // For nested workflows, add current group first
          addGroupToSteps();
          
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

          const nestedData = await GetAtmosTerraformCommands(
            nestedWorkflow,
            nestedFileName,
            nestedStack,
            visitedWorkflows
          );

          if (nestedData && nestedData.steps) {
            steps = steps.concat(nestedData.steps);
          }
        } else {
          if (currentTitle) {
            // We're in an echo group
            if (step.type === 'shell') {
              const shebang = `#!/bin/bash\n`;
              const titleComment = `# Run the ${step.name || 'script'} Script\n`;
              currentGroupCommands.push(`${shebang}${titleComment}${command}`);
            } else {
              let atmosCommand = `atmos ${command}`;
              if (stack) {
                atmosCommand += ` -s ${stack}`;
              }
              currentGroupCommands.push(atmosCommand);
            }
          } else {
            // Individual step
            if (step.type === 'shell') {
              const shebang = `#!/bin/bash\n`;
              const titleComment = `# Run the ${step.name || 'script'} Script\n`;
              steps.push({
                type: 'command',
                content: `${shebang}${titleComment}${command}`,
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
        }
      }

      // Add any remaining grouped commands
      addGroupToSteps();

      return { description: workflowDetails.description, steps };
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching or parsing the file:', error);
    return undefined;
  }
}
