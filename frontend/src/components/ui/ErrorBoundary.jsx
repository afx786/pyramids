import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[400px] p-xl text-center"
          style={{ color: 'rgb(var(--color-on-surface))' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-lg"
            style={{ background: 'rgb(var(--color-error-container))' }}
          >
            <span className="text-2xl" style={{ color: 'rgb(var(--color-error))' }}>!</span>
          </div>
          <h2 className="font-headline-md text-headline-md mb-sm" style={{ color: 'rgb(var(--color-primary))' }}>
            {this.props.fallbackTitle || 'Something went wrong'}
          </h2>
          <p className="font-body-sm text-body-sm max-w-md mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            {this.props.fallbackMessage || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-lg py-sm rounded-lg font-body-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
