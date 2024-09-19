// AtmosWorkflow.tsx

import React, { useEffect, useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Steps from '@site/src/components/Steps';

import { GetAtmosTerraformCommands } from './utils';
import { WorkflowStep } from './types';
import { WORKFLOWS_DIRECTORY_PATH } from './constants';

interface AtmosWorkflowProps {
  workflow: string;
  stack?: string;
  fileName: string;
}

export default function AtmosWorkflow({ workflow, stack = '', fileName }: AtmosWorkflowProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const fullFilePath = `${WORKFLOWS_DIRECTORY_PATH}${fileName}.yaml`;

  useEffect(() => {
    GetAtmosTerraformCommands(workflow, fileName, stack).then((cmds) => {
      if (Array.isArray(cmds)) {
        setSteps(cmds);
      } else {
        setSteps([]); // Default to an empty array if cmds is undefined or not an array
      }
    });
  }, [workflow, fileName, stack]);

  return (
    <Tabs queryString="workflows">
      <TabItem value="commands" label="Commands">
        <p>
          These are the commands included in the <code>{workflow}</code> workflow in the{' '}
          <code>{fullFilePath}</code> file:
        </p>
        <Steps>
          <ul>
            {steps.length > 0
              ? steps.map((step, index) => (
                  <li key={index}>
                    {step.type === 'title' ? (
                      <p>{step.content}</p>
                    ) : (
                      <CodeBlock language="bash">{step.content}</CodeBlock>
                    )}
                  </li>
                ))
              : 'No commands found'}
          </ul>
        </Steps>
        <p>Too many commands? Consider using the Atmos workflow! 🚀</p>
      </TabItem>
      <TabItem value="atmos" label="Atmos Workflow">
        <p>Run the following from your Geodesic shell using the Atmos workflow:</p>
        <CodeBlock language="bash">
          {`atmos workflow ${workflow} -f ${fileName} ${stack ? `-s ${stack}` : ''}`}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}
