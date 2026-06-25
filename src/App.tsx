import Schedule from './components/Schedule'
import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
    return (
        <>  
            <Toaster position="top-right" />
            <Schedule />
        </>
    )
}

export default App
