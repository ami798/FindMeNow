import React from 'react';

type ErrorBoundaryState = { hasError: boolean; message?: string };

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto mt-10 p-6 rounded-lg border border-red-200 bg-red-50 text-red-800">
          <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>
          <p className="text-sm">{this.state.message}</p>
          <p className="text-xs text-red-600 mt-2">Check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 