// ── Global error capture (debug) ──────────────────────────────────────────────
const _originalHandler = (globalThis as any).ErrorUtils?.getGlobalHandler?.();
(globalThis as any).ErrorUtils?.setGlobalHandler?.((error: any, isFatal: boolean) => {
  console.error("[GLOBAL_ERROR]", isFatal ? "FATAL" : "non-fatal", error?.message ?? error);
  console.error("[GLOBAL_STACK]", error?.stack ?? "(no stack)");
  if (_originalHandler) _originalHandler(error, isFatal);
});

import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
