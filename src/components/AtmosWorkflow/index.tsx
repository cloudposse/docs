import React, { useEffect, useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Steps from '@site/src/components/Steps';

import * as yaml from 'js-yaml';

// Define constants for the base URL and workflows directory path
const CLOUDPOSSE_DOCS_URL = 'https://raw.githubusercontent.com/cloudposse/docs/master/';
const WORKFLOWS_DIRECTORY_PATH = 'examples/snippets/stacks/workflows/';

async function GetAtmosTerraformCommands(
  workflow: string,
  fileName: string,
  stack?: string,
  visitedWorkflows = new Set<string>() // Keep track of visited workflows to avoid infinite loops
): Promise<string[] | undefined> {
  try {
    // Construct the full URL to the workflow YAML file
    const url = `${CLOUDPOSSE_DOCS_URL}${WORKFLOWS_DIRECTORY_PATH}${fileName}.yaml`;

    // Fetch the workflow file from the constructed URL
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch the file:', response.statusText);
      console.error('Workflow URL:', url);
      return undefined;
    }
    const fileContent = await response.text();

    // Parse the YAML content
    const workflows = yaml.load(fileContent) as any;

    // Find the specified workflow in the parsed YAML
    if (workflows && workflows.workflows && workflows.workflows[workflow]) {
      const workflowDetails = workflows.workflows[workflow];

      // Prevent infinite recursion in case of cyclic dependencies
      const workflowKey = `${fileName}:${workflow}`;
      if (visitedWorkflows.has(workflowKey)) {
        console.warn(`Already visited workflow ${workflow} in file ${fileName}, skipping to prevent infinite loop.`);
        return [];
      }
      visitedWorkflows.add(workflowKey);

      // Accumulate commands
      let commands: string[] = [];

      for (const step of workflowDetails.steps) {
        if (step.type && step.type === 'shell') {
          // If it's a shell command, you might want to handle it differently
          // For now, we'll skip shell commands
          continue;
        }

        let command = step.command;

        if (!step.type) {
          if (command.startsWith('workflow')) {
            // Extract nested workflow details
            const commandParts = command.split(' ');
            const nestedWorkflowIndex = commandParts.findIndex((part) => part === 'workflow') + 1;
            const nestedWorkflow = commandParts[nestedWorkflowIndex];

            // Extract file name if provided with -f or --file
            let nestedFileName = fileName; // Default to current file
            const fileFlagIndex = commandParts.findIndex((part) => part === '-f' || part === '--file');
            if (fileFlagIndex !== -1) {
              nestedFileName = commandParts[fileFlagIndex + 1];
            }

            // Extract stack if provided with -s or --stack
            let nestedStack = stack; // Default to current stack
            const stackFlagIndex = commandParts.findIndex((part) => part === '-s' || part === '--stack');
            if (stackFlagIndex !== -1) {
              nestedStack = commandParts[stackFlagIndex + 1];
            }

            // Recursive call for nested workflow
            const nestedCommands = await GetAtmosTerraformCommands(
              nestedWorkflow,
              nestedFileName,
              nestedStack,
              visitedWorkflows
            );

            if (nestedCommands) {
              commands = commands.concat(nestedCommands);
            }
          } else {
            // It's a regular atmos command
            command = `atmos ${command}`;
            if (stack) {
              command += ` -s ${stack}`;
            }
            commands.push(command);
          }
        }
      }

      return commands;
    }

    // Return undefined if the workflow is not found
    return undefined;
  } catch (error) {
    console.error('Error fetching or parsing the file:', error);
    return undefined;
  }
}

export default function AtmosWorkflow({ workflow, stack = "", fileName }) {
  const [commands, setCommands] = useState<string[]>([]);
  const fullFilePath = `${WORKFLOWS_DIRECTORY_PATH}${fileName}.yaml`;

  useEffect(() => {
    GetAtmosTerraformCommands(workflow, fileName, stack).then((cmds) => {
      if (Array.isArray(cmds)) {
        setCommands(cmds);
      } else {
        setCommands([]); // Default to an empty array if cmds is undefined or not an array
      }
    });
  }, [workflow, fileName, stack]);

  return (
    <Tabs queryString="workflows">
      <TabItem value="commands" label="Commands">
        These are the commands included in the <code>{workflow}</code> workflow in the <code>{fullFilePath}</code> file:
        <Steps>
          <ul>
            {commands.length > 0 ? commands.map((cmd, index) => (
              <li key={index}>
                <CodeBlock language="bash">
                  {cmd}
                </CodeBlock>
              </li>
            )) : 'No commands found'}
          </ul>
        </Steps>
        Too many commands? Consider using the Atmos workflow! 🚀
      </TabItem>
      <TabItem value="atmos" label="Atmos Workflow">
        Run the following from your Geodesic shell using the Atmos workflow:
        <CodeBlock language="bash">
          atmos workflow {workflow} -f {fileName} {stack && `-s ${stack}`}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}
