import React, { useEffect, useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Define a global constant for the workflows directory path
const WORKFLOWS_DIRECTORY_PATH = './examples/snippets/workflows';

function GetAtmosTerraformCommands(workflow: string, fileName: string): string[] | undefined {
  try {
    // Combine the directory path with the file name to get the full file path
    const filePath = `${WORKFLOWS_DIRECTORY_PATH}/${fileName}`;

    // Open and parse the YAML file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const workflows = yaml.load(fileContent) as any;

    // Find the specified workflow in the parsed YAML
    if (workflows && workflows.workflows && workflows.workflows[workflow]) {
      const workflowDetails = workflows.workflows[workflow];

      // Extract the commands under that workflow
      const commands = workflowDetails.steps.map((step: any) => step.command);

      return commands;
    }

    // Return undefined if the workflow is not found
    return undefined;
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
    return undefined;
  }
}

export default function AtmosWorkflow({ workflow, stack = "", fileName }) {
  const [commands, setCommands] = useState<string[] | undefined>([]);

  useEffect(() => {
    const commands = GetAtmosTerraformCommands(workflow, fileName);
    setCommands(commands);
  }, [workflow, fileName]);

  return (
    <Tabs queryString="command">
      <TabItem value="terraform" label="Atmos Terraform Commands">
        <code>
          {commands ? commands.join('\n') : 'No commands found'}
        </code>
      </TabItem>
      <TabItem value="workflow" label="Atmos Workflow Commands">
        <code>
          atmos workflow {workflow} -f {fileName} {stack && `-s ${stack}`}
        </code>
      </TabItem>
    </Tabs>
  );
};
