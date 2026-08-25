import React from 'react'

export default function CriteriaList({ items }) {
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={item.title} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gilt-400/50 font-display text-sm font-semibold text-gilt-500 dark:border-gilt-300/50 dark:text-gilt-300">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-parchment-100">
              {item.title}
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-800/80 dark:text-parchment-100/80">
              {item.points.map((point, j) => (
                <li key={j}>{point}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
