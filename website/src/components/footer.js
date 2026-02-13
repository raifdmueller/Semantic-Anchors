export function renderFooter(version) {
  return `
    <footer class="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p class="text-sm text-[var(--color-text-secondary)]">
            Semantic Anchors &mdash; Shared vocabulary for LLM communication
          </p>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >GitHub</a>
            <span class="text-xs text-[var(--color-text-secondary)]">v${version}</span>
          </div>
        </div>
      </div>
    </footer>
  `
}
