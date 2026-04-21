/**
 * YouTube click-to-load facade.
 *
 * Finds <button class="youtube-facade" data-video-id="..."> elements in a
 * container and replaces them with a real YouTube iframe on click. Until the
 * user clicks, the browser never contacts youtube.com or youtube-nocookie.com,
 * so no tracking cookies are set. This keeps the embed DSGVO-compliant.
 */

const VIDEO_ID_RE = /^[A-Za-z0-9_-]{6,20}$/

export function hydrateYouTubeFacades(root = document) {
  const buttons = root.querySelectorAll('button.youtube-facade[data-video-id]')
  buttons.forEach((button) => {
    if (button.dataset.hydrated === 'true') return
    button.dataset.hydrated = 'true'
    button.addEventListener('click', () => swapWithIframe(button), { once: true })
  })
}

function swapWithIframe(button) {
  const videoId = button.dataset.videoId
  if (!videoId || !VIDEO_ID_RE.test(videoId)) return

  const title = button.dataset.videoTitle || 'YouTube video'
  const iframe = document.createElement('iframe')
  // youtube-nocookie.com does not set tracking cookies unless playback starts.
  // Autoplay is safe here because activation is a user gesture (the click).
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
  iframe.title = title
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  iframe.setAttribute('allowfullscreen', '')
  iframe.className = 'absolute inset-0 w-full h-full border-0'

  const wrapper = document.createElement('div')
  wrapper.className = button.className.replace('youtube-facade', 'youtube-loaded')
  wrapper.style.position = 'relative'
  wrapper.appendChild(iframe)

  button.replaceWith(wrapper)
}
