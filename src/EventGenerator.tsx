import { Button, Heading, majorScale, Menu, minorScale, Pane, PaneProps, Popover, Position } from 'evergreen-ui';
import React, { useState } from 'react';
import { EventEditor } from './components/EventEditor';
import { segmentEventReference } from './http/segment-spy';

type EventTypes = 'alias' | 'group' | 'identify' | 'page' | 'track';

function capitalizeLabel(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1);
}

export type EventGeneratorProps = Omit<PaneProps, 'children'>

export const EventGenerator: React.FC<EventGeneratorProps> = (props) => {
  const [eventType, setEventType] = useState<EventTypes>();
  const [content, setContent] = useState<string | undefined>();

  const label = capitalizeLabel(eventType || 'Choose an event type...');
  const editorContent = eventType ? examples[eventType] : examples.default;
  return (
    <Pane {...props}>
      <Pane>
        <Heading size={600} marginBottom={minorScale(1)}>Event Generator</Heading>
      </Pane>
      <Pane>
        <EventEditor content={editorContent} onChange={setContent} />
      </Pane>
      <Pane display="flex" paddingTop={minorScale(2)} paddingBottom={minorScale(2)} background="tint1" borderRadius={3}>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => {    
            function createSelect(type: EventTypes) {
              return () => {
                setEventType(type);
                close();
              }
            }
            return (
              <Menu>
                <Menu.Item onSelect={createSelect('alias')}>Alias</Menu.Item>
                <Menu.Item onSelect={createSelect('group')}>Group</Menu.Item>
                <Menu.Item onSelect={createSelect('identify')}>Identify</Menu.Item>
                <Menu.Item onSelect={createSelect('page')}>Page</Menu.Item>
                <Menu.Item onSelect={createSelect('track')}>Track</Menu.Item>
              </Menu>
            )
          }}
        >
          <Button>{label}</Button>
        </Popover>
        <Button appearance="primary" marginLeft={minorScale(3)} onClick={() => {
          segmentEventReference.emit('http', '')
          eval(content ?? '')
        }}>Run</Button>
      </Pane>
    </Pane>
  )
}

const defaultContent = `
// Click the button below to choose an event type.
`.trim()

const comments = `
/* Feel free to update the code, then press 'Run' to generate an event! */
`.trim()

const aliasExample = `
${comments}
analytics.alias('new-id-111', 'old-id-111')
`.trim()

const identifyExample = `
${comments}
analytics.identify('111111-222222', {
  name: 'My Name',
  email: 'testing@test.com'
})
`.trim()

const groupExample = `
${comments}
analytics.group('UNIVAC Working Group', {
  principles: ['Eckert', 'Mauchly'],
  site: 'Eckert-Mauchly Computer Corporation',
  statedGoals: 'Develop the first commercial computer',
  industry: 'Technology'
})
`.trim()

const pageExample = `
${comments}
analytics.page('Pricing', {
  title: 'My Overridden Title'
})
`.trim()

const trackExample = `
${comments}
analytics.track('Article Completed', {
  title: 'How to Create a Trackin Plan',
  course: 'Intro to Analytics'
})
`.trim();

const examples: Record<EventTypes |'default', string> = {
  default: defaultContent,
  alias: aliasExample,
  group: groupExample,
  identify: identifyExample,
  page: pageExample,
  track: trackExample
}