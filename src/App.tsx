import Schedule from './components/Schedule'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './store/useTheme'

function App() {
    useTheme()

    return (
        <>
            <Toaster position="top-right" />
            <ErrorBoundary>
                <Schedule />
            </ErrorBoundary>
        </>
    )
}

export default App
