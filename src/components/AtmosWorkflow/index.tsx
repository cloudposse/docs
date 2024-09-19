// index.tsx

import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import Note from '@site/src/components/Note';
import Steps from '@site/src/components/Steps';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

import { GetAtmosTerraformCommands } from './utils';
import { WorkflowStep, WorkflowData } from './types';
import { WORKFLOWS_DIRECTORY_PATH } from './constants';

interface AtmosWorkflowProps {
  workflow: string;
  stack?: string;
  fileName: string;
}

export default function AtmosWorkflow({ workflow, stack = '', fileName }: AtmosWorkflowProps) {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const fullFilePath = `${WORKFLOWS_DIRECTORY_PATH}${fileName}.yaml`;

  useEffect(() => {
    GetAtmosTerraformCommands(workflow, fileName, stack).then((data) => {
      if (data) {
        setWorkflowData(data);
      } else {
        setWorkflowData(null);
      }
    });
  }, [workflow, fileName, stack]);

  return (
    <Tabs queryString="workflows">
      <TabItem value="commands" label="Commands">
        <Note title={workflow}>
          These are the commands included in the <code>{workflow}</code> workflow in the{' '}
          <code>{fullFilePath}</code> file:
        </Note>
        {workflowData?.description && (
          <h4 className=".workflow-title">
            {workflowData.description}
          </h4>
        )}
        <Steps>
          <ul>
            {workflowData?.steps.length ? (
              workflowData.steps.map((step, index) => (
                <li key={index}>
                  {step.type === 'title' ? (
                    <p className=".workflow-title">
                      {step.content}
                    </p>
                  ) : (
                    <CodeBlock language="bash">{step.content}</CodeBlock>
                  )}
                </li>
              ))
            ) : (
              'No commands found'
            )}
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
