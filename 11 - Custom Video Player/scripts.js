const player = document.querySelector('.player')
const video = player.querySelector('.viewer')
const progress = player.querySelector('.progress')
const progressBar = player.querySelector('.progress__filled')
const toggle = player.querySelector('.toggle')
const skipButtons = player.querySelectorAll('[data-skip]')
const ranges = player.querySelectorAll('.player__slider')
const fullscreen = player.querySelector('.button__fullscreen')
const state = {
  isMouseDown: false
}

function togglePlay () {
  const method = video.paused ? 'play' : 'pause'
  video[method]()
}

function updateButton () {
  const icon = this.paused ? '►' : '❚ ❚'
  toggle.textContent = icon
}

function skip () {
  video.currentTime += Number.parseFloat(this.dataset.skip)
}

function handleRangeUpdate (e) {
  if (!state.isMouseDown && e.type === 'mousemove') {
    return
  }
  video[this.name] = this.value
}

function handleProgress () {
  const percent = (video.currentTime / video.duration) * 100
  progressBar.style.flexBasis = `${percent}%`
}

function scrub (e) {
  if (!state.isMouseDown && e.type === 'mousemove') {
    return
  }
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
  video.currentTime = scrubTime
}

function handleFullscreen (e) {
  console.log('Implement: https://github.com/rafrex/fscreen for native API.')
}

video.addEventListener('click', togglePlay)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)
video.addEventListener('timeupdate', handleProgress)

toggle.addEventListener('click', togglePlay)
Array.from(skipButtons).map(button => button.addEventListener('click', skip))
Array.from(ranges).map(range => {
  range.addEventListener('change', handleRangeUpdate)
  range.addEventListener('mousemove', handleRangeUpdate)
})

document.addEventListener('mousedown', () => {
  state.isMouseDown = true
})
document.addEventListener('mouseup', () => {
  state.isMouseDown = false
})

progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', scrub)

fullscreen.addEventListener('click', handleFullscreen)
