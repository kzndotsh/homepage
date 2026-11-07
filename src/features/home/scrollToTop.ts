/** Back to the hero: drops any #section from the URL (keeping Back useful) and scrolls up. */
export function scrollToTop() {
  if (window.location.hash) history.pushState(null, '', '/')
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' })
}
