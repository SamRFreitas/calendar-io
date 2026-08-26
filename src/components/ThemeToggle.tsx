import { useTheme } from '@/store/useTheme'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="theme-toggle-button"
            aria-pressed={isDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            data-testid="theme-toggle-button"
        >
            <svg
                viewBox="0 0 24 24"
                className={`theme-toggle-icon ${isDark ? 'theme-toggle-icon-hidden' : ''}`}
                fill="none"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12h2.5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8" />
                </g>
            </svg>
            <svg
                viewBox="0 0 24 24"
                className={`theme-toggle-icon ${!isDark ? 'theme-toggle-icon-hidden' : ''}`}
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
            </svg>
        </button>
    )
}
