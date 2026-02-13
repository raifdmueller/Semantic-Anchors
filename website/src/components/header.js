export function renderHeader() {
  return `
    <header class="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold text-[var(--color-text)]">
            <a href="/" class="no-underline text-inherit">Semantic Anchors</a>
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button
            id="lang-toggle"
            class="rounded-md px-2 py-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            aria-label="Toggle language"
          >DE</button>
          <button
            id="theme-toggle"
            class="rounded-md p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            aria-label="Toggle dark mode"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  `
}
