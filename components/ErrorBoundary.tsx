import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    let message = "Ocorreu um erro inesperado.";
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.error) {
        message = `Erro no Banco de Dados: ${parsed.error}`;
      }
    } catch {
      message = error.message;
    }
    return { hasError: true, errorMessage: message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-triangle-exclamation text-red-600 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Ops! Algo deu errado</h2>
          <p className="text-red-600 text-sm mb-6">{this.state.errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Recarregar Aplicativo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
