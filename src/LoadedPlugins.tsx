import React, { useEffect, useState } from 'react';
import { Heading, IconButton, majorScale, minorScale, Pane, PaneProps, Text, TrashIcon } from 'evergreen-ui';
import { ajsSpy, Analytics, analytics } from './analytics';
import { AnyBrowserPlugin } from '@segment/analytics-next';

export type LoadedPluginsProps = Omit<PaneProps, 'children'>

export const LoadedPlugins: React.FC<LoadedPluginsProps> = (props) => {
  const [plugins, setPlugins ] = useState(analytics['instance']?.queue.plugins ?? [])

  useEffect(() => {
    function onChange(analytics: Analytics) {
      setPlugins([...analytics.queue.plugins])
    }
    ajsSpy.on('register', onChange);
    ajsSpy.on('deregister', onChange);
    return function cleanup() {
      ajsSpy.off('register', onChange);
      ajsSpy.off('deregister', onChange);
    }
  })
  
  const filteredPlugins = sortPlugins(plugins.filter((plugin) => plugin.name !== 'Mutator Plugin'));

  const items = filteredPlugins.length 
      ? filteredPlugins.map((plugin) => <PluginItem plugin={plugin} />)
      : <Text flex={1}>No plugins found.</Text>
  return (
    <Pane {...props} flexDirection='column'>
      <Heading size={700} marginBottom={minorScale(3)}>Registered Plugins</Heading>
      {items}
    </Pane>
  )
}

function sortPlugins(plugins: AnyBrowserPlugin[]): AnyBrowserPlugin[] {
  const before = [];
  const enrichment = [];
  const destination = [];
  const after = [];

  for (const plugin of plugins) {
    if (plugin.type === 'before') before.push(plugin);
    if (plugin.type === 'enrichment') enrichment.push(plugin);
    if (plugin.type === 'destination') destination.push(plugin);
    if (plugin.type === 'after') after.push(plugin);
  }

  return [...before, ...enrichment, ...destination, ...after];
}

export type PluginItemProps = {
  plugin: AnyBrowserPlugin
}
const PluginItem: React.FC<PluginItemProps> = ({plugin}) => {
  const disallowRemoval = ['Segment.io'].includes(plugin.name)
  return (
    <Pane marginBottom={minorScale(3)}>
      <IconButton onClick={() => {
        analytics.deregister(plugin.name)
      }} size='small' icon={TrashIcon} disabled={disallowRemoval} intent="danger" marginRight={majorScale(2)} />
      <Text>{plugin.type}: </Text>
      <Text>{plugin.name}</Text>
    </Pane>
  )
}