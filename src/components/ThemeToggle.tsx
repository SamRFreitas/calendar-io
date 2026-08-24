import { useTheme } from '@/store/useTheme'
import type { Theme } from '@/store/uiSlice'

const options: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
]

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="view-toggle-container">
            <div className="view-toggle-group">
                {options.map(({ value, label }) => (
                    <button
                        key={value}
                        className={`view-toggle-button ${
                            theme === value ? 'view-toggle-button-active' : ''
                        }`}
                        onClick={() => setTheme(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}
