import Editor, {EditorProps} from '@monaco-editor/react';
import { Button, Heading, majorScale, Menu, minorScale, Pane, PaneProps, Popover, Position, Text } from 'evergreen-ui';
import React, { useEffect, useRef, useState } from 'react';

type StandaloneEditor = Parameters<NonNullable<EditorProps['onMount']>>[0]

export type PluginEditorProps = Omit<PaneProps, 'children'>

export const PluginEditor: React.FC<PluginEditorProps> = (props) => {
  const editorRef = useRef<StandaloneEditor | null>(null);
  const [pluginCode, setPluginCode] = useState<string>(pluginJSTemplate);
  const [pluginSelection, setPluginSelection] = useState<PluginSamples>('default')
  
  return (
    <Pane {...props}>
      <Pane>
        <Heading size={600} marginBottom={minorScale(1)}>Plugin Editor</Heading>
      </Pane>
      <Pane display="flex" paddingTop={minorScale(2)} paddingBottom={minorScale(2)} background="tint1" borderRadius={3}>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => {    
            function createSelection(type: PluginSamples) {
              return () => {
                setPluginSelection(type);
                setPluginCode(examples[type]);
                close();
              }
            }
            return (
              <Menu>
                <Menu.Item onSelect={createSelection('default')}>{selectionToNames['default']}</Menu.Item>
                <Menu.Item onSelect={createSelection('filterPages')}>{selectionToNames['filterPages']}</Menu.Item>
              </Menu>
            )
          }}
        >
          <Button>{selectionToNames[pluginSelection]}</Button>
        </Popover>
        <Button appearance="primary" marginLeft={minorScale(3)} onClick={() => {
          eval(pluginCode ?? '')
        }}>Register</Button>
      </Pane>
      <Pane height="80vh" border="default">
        <Editor
          defaultLanguage='javascript'
          value={pluginCode}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(value) => {
            setPluginCode(value ?? '')
          }}
          options={{
            minimap: {
              enabled: false
            }
          }}
        />
      </Pane>
    </Pane>
  )
}

const pluginJSTemplate = `
class ExamplePlugin {
  constructor() {
    this.name = 'Example Plugin';
    // before, enrichment, destination, after
    this.type = 'before';
    this.version = '1';
  }

  isLoaded() {
    return true;
  }

  async load(ctx, analytics) {
    return;
  }

  async alias(ctx) {
    return ctx;
  }

  async group(ctx) {
    return ctx;
  }

  async identify(ctx) {
    return ctx;
  }

  async page(ctx) {
    return ctx;
  }

  async track(ctx) {
    return ctx;
  }
}

/* IMPORTANT - we need to register the plugin! */
analytics.register(new ExamplePlugin())
`.trim()



type PluginSamples = 'default'|'filterPages';

const selectionToNames: Record<PluginSamples, string> = {
  default: 'Barebones Example',
  filterPages: 'Filter Pages Example'
}

const filterPagesSample = `
class FilterPagesPlugin {
  constructor() {
    this.name = 'Filter Pages Plugin';
    // before, enrichment, destination, after
    this.type = 'before';
    this.version = '1';
  }

  isLoaded() {
    return true;
  }

  async load(ctx, analytics) {
    return;
  }

  async page(ctx) {
    const url = new URL(window.location.href);
    // Filter out any page events when the
    // page has "?test" in it.
    if (url.searchParams.has('test')) {
      throw new Error('Skip this event!');
    }
    
    return ctx;
  }
}

/* IMPORTANT - we need to register the plugin! */
analytics.register(new FilterPagesPlugin())
`.trim()

const examples: Record<PluginSamples, string> = {
  default: pluginJSTemplate,
  filterPages: filterPagesSample
}