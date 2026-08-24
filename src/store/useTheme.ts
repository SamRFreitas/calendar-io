import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { setTheme, type Theme } from './uiSlice'

export function useTheme() {
    const theme = useAppSelector((state) => state.ui.theme)
    const dispatch = useAppDispatch()

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    return {
        theme,
        setTheme: (value: Theme) => dispatch(setTheme(value)),
    }
}
