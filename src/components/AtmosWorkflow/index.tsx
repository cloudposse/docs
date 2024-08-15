import React, { useEffect, useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import * as yaml from 'js-yaml';

// Define constants for the base URL and workflows directory path
const CLOUDPOSSE_DOCS_URL = 'https://raw.githubusercontent.com/cloudposse/docs/master/';
const WORKFLOWS_DIRECTORY_PATH = 'examples/snippets/stacks/workflows/';

async function GetAtmosTerraformCommands(workflow: string, fileName: string, stack?: string): Promise<string[] | undefined> {
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
    console.log('Parsed YAML:', workflows);

    // Find the specified workflow in the parsed YAML
    if (workflows && workflows.workflows && workflows.workflows[workflow]) {
      const workflowDetails = workflows.workflows[workflow];

      // Extract the commands under that workflow
      const commands = workflowDetails.steps.map((step: any) => {
        let command = step.command;
        // TODO handle nested Atmos Workflows
        // For example: https://raw.githubusercontent.com/cloudposse/docs/master/examples/snippets/stacks/workflows/identity.yaml
        if (!step.type) {
          command = `atmos ${command}`;
          if (stack) {
            command += ` -s ${stack}`;
          }
        }
        return command;
      });

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

  useEffect(() => {
    GetAtmosTerraformCommands(workflow, fileName, stack).then((cmds) => {
      if (Array.isArray(cmds)) {
        setCommands(cmds);
      } else {
        setCommands([]); // Default to an empty array if cmds is undefined or not an array
      }
    });
  }, [workflow]);

  return (
    <Tabs queryString="command">
      <TabItem value="expanded" label="Commands">
        <pre>
          <code>
            {commands.length > 0 ? commands.map((cmd, index) => (
              <div key={index}>{cmd}</div>
            )) : 'No commands found'}
          </code>
        </pre>
      </TabItem>
      <TabItem value="workflow" label="Atmos Workflow">
        <pre>
          <code>
            atmos workflow {workflow} -f {fileName} {stack && `-s ${stack}`}
          </code>
        </pre>
      </TabItem>
    </Tabs>
  );
}
