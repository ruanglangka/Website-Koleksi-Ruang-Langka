import React from 'react'

function ArrowDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-gilt-400 dark:text-gilt-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4v14" />
      <path d="M6 12l6 6 6-6" />
    </svg>
  )
}

export default function ProcedureFlow({ steps }) {
  return (
    <ol className="mx-auto flex max-w-md flex-col items-stretch">
      {steps.map((step, i) => (
        <li key={i} className="flex flex-col items-center">
          <div className="flex w-full items-center gap-3 rounded-lg border border-navy-500/15 bg-navy-50 px-4 py-3 text-center shadow-sm dark:border-gilt-400/15 dark:bg-ink-800">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-500 font-display text-xs font-semibold text-parchment-50 dark:bg-gilt-400 dark:text-ink-900">
              {i + 1}
            </span>
            <p className="flex-1 text-sm font-medium leading-snug text-ink-900 dark:text-parchment-100">
              {step}
            </p>
          </div>
          {i < steps.length - 1 && (
            <div className="py-1.5">
              <ArrowDown />
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
