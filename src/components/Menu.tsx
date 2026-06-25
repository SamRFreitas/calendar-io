import { type ReactNode } from 'react'

interface MenuProps {
  children: ReactNode
}

export default function Menu({ children }: MenuProps) {

  return (
    <div className="flex justify-between gap-4 p-4 bg-[#1a1a1a] rounded-xl shadow-sm mb-6">
      {children}
    </div>
  )

}