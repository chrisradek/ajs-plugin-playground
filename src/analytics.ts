import { AnalyticsBrowser } from '@segment/analytics-next'
import { MutatorPlugin } from './mutator-plugin';

export { Analytics } from '@segment/analytics-next'
export const analytics = new AnalyticsBrowser();
(window as any).analytics = analytics;
export const ajsSpy = new MutatorPlugin();
analytics.register(ajsSpy)
analytics.load({
  writeKey: 'plugin-app',
  cdnSettings: {
    integrations: {
      "Segment.io": {
        apiHost: 'api.segment.io/v1',
        apiKey: 'plugin-app',
        maybeBundledConfigIds: {},
        unbundledIntegrations: [],
        versionSettings: { version: '4.4.7', componentTypes: ["browser"]}
      }
    }
  }
})

