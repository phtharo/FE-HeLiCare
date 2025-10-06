import React, { useState, useRef, useEffect } from 'react'

type DropdownItem = {
  label: string
  value: string
  disabled?: boolean
}

type DropdownProps = {
  items: DropdownItem[]
  // label can be string or a JSX element (icon button)
  label?: string | React.ReactNode
  // variant: default menu or stacked panel that looks like the sidebar
  variant?: 'default' | 'stacked'
  onSelect?: (item: DropdownItem) => void
  className?: string
}

export default function Dropdown({ items, label = 'Open', onSelect, className = '', variant = 'default' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (open) setActiveIndex(0)
    else setActiveIndex(null)
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i === null ? 0 : Math.min(items.length - 1, i + 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i === null ? items.length - 1 : Math.max(0, i - 1)))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (activeIndex !== null) selectItem(items[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function selectItem(item: DropdownItem) {
    if (item.disabled) return
    onSelect?.(item)
    setOpen(false)
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={rootRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        className={"px-3 py-1 rounded " + (variant === 'default' ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-transparent text-slate-700 hover:bg-slate-100')}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            setOpen(true)
            e.preventDefault()
          }
        }}
      >
        {/* support JSX label (icon) or simple string */}
        {typeof label === 'string' ? label : label}
      </button>

      {open && (
        variant === 'default' ? (
          <ul
            role="menu"
            aria-label={typeof label === 'string' ? label : 'menu'}
            onKeyDown={handleKeyDown}
            className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            {items.map((it, idx) => (
              <li
                key={it.value}
                role="menuitem"
                aria-disabled={it.disabled}
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => selectItem(it)}
                className={`px-3 py-2 cursor-pointer text-sm ${it.disabled ? 'text-gray-400 cursor-not-allowed' : activeIndex === idx ? 'bg-slate-100' : 'text-slate-800'}`}
              >
                {it.label}
              </li>
            ))}
          </ul>
        ) : (
          // stacked / panel style: larger rounded card with stacked items like sidebar
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white/95 backdrop-blur-md shadow-md ring-1 ring-black/5 z-50 p-2">
            <div className="flex flex-col gap-1">
              {items.map((it, idx) => (
                <button
                  key={it.value}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => selectItem(it)}
                  disabled={it.disabled}
                  className={`text-left w-full px-4 py-3 rounded-lg text-sm font-medium ${it.disabled ? 'text-gray-400 cursor-not-allowed' : activeIndex === idx ? 'bg-slate-100 text-slate-900' : 'text-slate-800 hover:bg-slate-50'}`}
                >
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  )
}
