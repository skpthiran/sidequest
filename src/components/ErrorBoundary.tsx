import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  declare props: Readonly<Props>;
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SideQuest crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-6">
          <div className="glass-card rounded-3xl p-10 max-w-md w-full text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-text-secondary">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.href = '/app'}
              className="mt-4 px-6 py-3 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
