import { type ReactNode } from 'react'

interface MenuProps {
  children: ReactNode
}

export default function Menu({ children }: MenuProps) {

  return (
    <div className="menu-container"> {children} </div>
  )

}