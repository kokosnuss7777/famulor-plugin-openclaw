// Type stubs for OpenClaw Plugin SDK
// These are resolved at runtime by OpenClaw

declare module 'openclaw/plugin-sdk/plugin-entry' {
  export function definePluginEntry(config: any): any;
}

declare module 'openclaw/plugin-sdk/channel-core' {
  export function defineChannelPluginEntry(config: any): any;
  export function defineSetupPluginEntry(config: any): any;
}
