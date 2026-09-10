import { Component, type ErrorInfo, type ReactNode } from 'react';
import Fallback from '@/components/error/Fallback';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled application error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
