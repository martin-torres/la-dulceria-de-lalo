import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: '' };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo: errorInfo.componentStack || '' });
    console.error('Admin Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Algo salió mal
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Error al cargar el módulo de administración'}
            </p>
            <details className="text-left mb-4">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Ver detalles técnicos
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {this.state.error?.stack || this.state.errorInfo}
              </pre>
            </details>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
