import Editor from '@monaco-editor/react';
import { Heading, minorScale, Pane, PaneProps } from 'evergreen-ui';
import React, { useEffect, useState } from 'react';
import { segmentEventReference } from '../http/segment-spy';

export type SegmentViewerProps = Omit<PaneProps, 'children'>

export const SegmentViewer: React.FC<SegmentViewerProps> = (props) => {
  const [eventBody, setEventBody] = useState<any>();

  useEffect(() => {
    function onEvent(body: any) {
      setEventBody(body);
    }
    segmentEventReference.on('http', onEvent);
    return function cleanup() {
      segmentEventReference.off('http', onEvent);
    }
  });
  
  return (
    <Pane {...props}>
      <Pane>
        <Heading size={600} marginBottom={minorScale(1)}>Sent Event</Heading>
      </Pane>
      <Pane height="50vh" border="default">
        <Editor
          defaultLanguage='json'
          value={eventBody ?? ''}
          options={{
            minimap: {
              enabled: false
            },
            readOnly: true,
            lineNumbers: 'off'
          }}
        />
      </Pane>
    </Pane>
  )
}

