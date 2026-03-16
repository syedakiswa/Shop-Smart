import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-center">
          <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
          <p className="mt-2 text-zinc-400">
            {this.state.error?.message.startsWith('{') 
              ? 'A database permission error occurred. Please check your access rights.' 
              : 'An unexpected error occurred.'}
          </p>
          <button
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
