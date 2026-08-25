import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
        console.error('Unhandled error in Schedule tree:', error, info.componentStack)
    }

    render() {
        if (this.state.error) {
            return (
                <div className="error-screen">
                    <p className="error-text">Something went wrong: {this.state.error.message}</p>
                    <button
                        onClick={() => this.setState({ error: null })}
                        className="retry-button"
                    >
                        Try again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
