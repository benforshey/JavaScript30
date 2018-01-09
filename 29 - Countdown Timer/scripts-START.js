const timerDisplay = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')
const buttons = Array.from(document.querySelectorAll('[data-time]'))
let countdown  // Global scope. Yuck.

function handleTimer (seconds) {
  const now = Date.now()
  const then = now + seconds * 1000  // now is in milliseconds, so convert "seconds" to milliseconds
  clearInterval(countdown)  // Clear the old timers.

  // setInterval pauses in background, so it can't be used to tick core functionality of timer.
  // It *can* be used to update the display, however.
  countdown = window.setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000) // return to seconds

    if (secondsLeft <= 0) {
      clearInterval(countdown)
    }

    return displayTimeLeft(secondsLeft)
  }, 1000)

  displayTimeLeft(seconds)  // Display the time remaining before the first interval has elapsed.
  displayEndTime(then)
}

function displayTimeLeft (seconds) {
  const minutes = Math.floor(seconds / 60)
  // const remainderSeconds = (seconds % 60).toString(10).padStart(2, '0')  // Low broswer support, but easiest fix.
  const remainderSeconds = (seconds % 60)
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`

  document.title = display
  timerDisplay.textContent = display
}

function displayEndTime (timestamp) {
  const end = new Date(timestamp)
  const hour = end.getHours()
  const minutes = end.getMinutes()
  const meridian = hour > 12 ? 'pm' : 'am'

  // endTime.textContent = `Be Back at ${hour}:${minutes}`  // 24-hour time
  endTime.textContent = `Be Back at ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}${meridian}`  // 12-hour time.
}

buttons.map(button => button.addEventListener('click', function (e) {
  const seconds = Number.parseInt(this.dataset.time)

  return handleTimer(seconds)
}))

document.customForm.addEventListener('submit', function (e) {
  e.preventDefault()
  e.stopPropagation()

  const mins = this.minutes.value
  const seconds = mins * 60
  return handleTimer(seconds)
})
