// index.tsx

import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import Note from '@site/src/components/Note';
import Steps from '@site/src/components/Steps';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import './styles.css';

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
  const [isLoading, setIsLoading] = useState(true);
  const fullFilePath = `${WORKFLOWS_DIRECTORY_PATH}${fileName}.yaml`;

  useEffect(() => {
    setIsLoading(true);
    
    GetAtmosTerraformCommands(workflow, fileName, stack).then((data) => {
      if (data) {
        setWorkflowData(data);
      } else {
        // Throw error to fail the build
        throw new Error(`Workflow file not found: ${fullFilePath}`);
      }
      setIsLoading(false);
    }).catch((err) => {
      // Throw error to fail the build
      throw new Error(`Failed to load workflow file: ${fullFilePath}. Error: ${err.message}`);
    });
  }, [workflow, fileName, stack, fullFilePath]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="atmos-workflow">
        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          Loading workflow...
        </div>
      </div>
    );
  }

  return (
    <div className="atmos-workflow">
      <Tabs queryString="workflows">
        <TabItem value="commands" label="Commands">
          <Note>
            These are the commands included in the <code>{workflow}</code> workflow in the{' '}
            <code>stacks/workflows/{fileName}.yaml</code> file:
          </Note>
          {workflowData?.description && (
            <p className=".workflow-title">
              {workflowData.description}
            </p>
          )}
          <Steps>
            <ul>
              {workflowData?.steps.length ? (
                workflowData.steps.map((step, index) => (
                  <li key={index}>
                    {step.type === 'title' ? (
                      <>
                        <h4 className=".workflow-title">
                          {step.content.split('\n\n')[0]}
                        </h4>
                        <CodeBlock language="bash">
                          {step.content.split('\n\n')[1]}
                        </CodeBlock>
                      </>
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
    </div>
  );
}
