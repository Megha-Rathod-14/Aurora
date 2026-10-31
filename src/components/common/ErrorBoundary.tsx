import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in AURORA:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 select-none">
          <div className="max-w-lg w-full bg-[#121218] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,37,138,0.2)] text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#FF258A] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold font-['Outfit'] bg-gradient-to-r from-white via-[#00D9FF] to-[#FF258A] bg-clip-text text-transparent mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[#A0A0AA] mb-6">
              AURORA encountered an unexpected rendering error. You can try refreshing or resetting your cached local data.
            </p>

            {this.state.error && (
              <div className="bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 mb-6 text-left overflow-x-auto max-h-40 text-xs font-mono text-[#00D9FF]">
                <p className="font-bold text-[#FF258A] mb-1">{this.state.error.name}: {this.state.error.message}</p>
                {this.state.error.stack && (
                  <pre className="text-[11px] text-[#A0A0AA] whitespace-pre-wrap">{this.state.error.stack}</pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white font-bold text-xs shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>

              <button
                onClick={this.handleResetData}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 hover:border-red-500/40 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

