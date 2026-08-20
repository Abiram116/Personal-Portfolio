import { Component, type ReactNode } from 'react';

/**
 * Keeps decorative, GPU-dependent extras from taking the page down with them.
 *
 * The ASCII/Three.js scene can fail on a machine with no WebGL, a blocked
 * canvas, or a driver quirk. Without this, one throw during render unmounts the
 * whole app and the visitor sees a blank screen — which is exactly what
 * happened before this existed.
 */
type Props = { children: ReactNode; fallback?: ReactNode };
type State = { failed: boolean };

export default class SafeBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[portfolio] decorative layer disabled:', error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
