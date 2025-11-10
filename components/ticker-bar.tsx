"use client"

const DEMO_TICKER = [
  "Samsung Galaxy S25 Ultra leaked: specs reveal major upgrades",
  "Google Pixel 9 Pro review: AI photography reaches new heights",
  "OnePlus 13 confirmed for January 2025 global launch",
]

export function TickerBar() {
  return (
    <div className="bg-secondary border-b">
      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <ul className="flex items-center gap-6 text-xs sm:text-sm whitespace-nowrap">
          {DEMO_TICKER.map((item, i) => (
            <li key={i} className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
