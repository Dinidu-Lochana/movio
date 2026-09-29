import { useSyncExternalStore } from 'react';

// Tiny external store counting in-flight API requests; drives the global loader bar.
let pending = 0;
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());

export function requestStarted() {
  pending += 1;
  emit();
}

export function requestFinished() {
  pending = Math.max(0, pending - 1);
  emit();
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** True while at least one API request is in flight. */
export function useIsLoading() {
  return useSyncExternalStore(subscribe, () => pending > 0);
}
