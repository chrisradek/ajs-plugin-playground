import React, { useRef } from 'react';
import Editor, {EditorProps} from '@monaco-editor/react';
import { Pane } from 'evergreen-ui';

type StandaloneEditor = Parameters<NonNullable<EditorProps['onMount']>>[0]

export type EventEditorProps = {
  content: string;
  onChange: (value?: string) => void;
}

export const EventEditor: React.FC<EventEditorProps> = ({content, onChange}) => {
  const editorRef = useRef<StandaloneEditor | null>(null);
  
  return (
    <Pane border="default" height="50vh">
      <Editor
        defaultLanguage='javascript'
        value={content}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(value) => {
          onChange(value ?? '');
        }}
        options={{
          minimap: {
            enabled: false
          },
          scrollbar: {
            vertical: "auto"
          }
        }}
      />
    </Pane>
  )
}