import Schedule from './components/Schedule'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './store/useTheme'

function App() {
    useTheme()

    return (
        <>
            <Toaster position="top-right" />
            <Schedule />
        </>
    )
}

export default App
