import React from 'react';
import './http/segment-spy';
import './analytics';
import './App.css';
import { majorScale, Heading, Pane } from 'evergreen-ui';
import { LoadedPlugins } from './LoadedPlugins';
import { PluginEditor } from './components/PluginEditor';
import { EventGenerator } from './EventGenerator';
import { SegmentViewer } from './components/SegmentViewer';


function App() {
  return (
    //<Pane height='100vh' width='100vw' display='flex' alignItems='center' justifyContent='center' border='none' alignSelf='center'>
    <Pane display='flex' padding={majorScale(1)} flexDirection='column' background='tint1'>
      <Pane marginBottom={majorScale(1)}>
        <Heading size={800} flex={1}>Analytics.js Plugin Tester</Heading>
      </Pane>
      <Pane display="flex" flexWrap="wrap" justifyContent="space-between">
        <EventGenerator width="48vw" />
        <SegmentViewer width="48vw"/>
      </Pane>
      <LoadedPlugins flex={10} width="49vw" />
      <PluginEditor />
    </Pane>
  );
}

export default App;