import { Component, type ReactNode, type ErrorInfo } from 'react'
import ScreenError from './ScreenError'
import { logError } from '@/utils/errorHelpers'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logError('ErrorBoundary', error)
    logError('ErrorBoundary: component stack', info.componentStack)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScreenError
          title="Something went wrong"
          message={this.state.error?.message ?? 'An unexpected error occurred'}
          onRetry={this.handleReset}
        />
      )
    }
    return <>{this.props.children}</>
  }
}
