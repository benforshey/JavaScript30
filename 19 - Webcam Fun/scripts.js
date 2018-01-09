const takePhotoButton = document.querySelector('.photobooth__takePhoto')
const video = document.querySelector('.player')
const canvas = document.querySelector('.photo')
const ctx = canvas.getContext('2d')
const strip = document.querySelector('.strip')
const snap = document.querySelector('.snap')

function getVideo () {
  navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: 'user',
      frameRate: { ideal: 60 }
    },
    // video: true,
    audio: false
  })
  .then(localMediaStream => {
    video.srcObject = localMediaStream
    video.play()
    console.log(localMediaStream)
  })
  .catch(err => console.error(`Video was denied permissions. The error is: ${err}`))
}

function paintToCanavas () {
  const width = video.videoWidth
  const height = video.videoHeight

  canvas.width = width
  canvas.height = height

  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)  // Comes first (must come first) to draw image into canvas.

    let pixels = ctx.getImageData(0, 0, width, height)  // Gets pixel RGBA from canvas and puts into Uint8ClampedArray.

    // pixels = redEffect(pixels)  // Modify pixels.
    // pixels = RGBSplit(pixels)  // Modify pixels.
    pixels = greenScreen(pixels)  // Modify pixels.

    // ctx.globalAlpha = 0.1  // 1/10th alpah, stacking on canvas. A ghosting effect, in essence.
    ctx.putImageData(pixels, 0, 0)  // Put back pixels into canvas.
  }, 16.666666667)  // 60fps (1000ms / 60 = 16.666666667)
}

function redEffect (pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {  // '4', because first is Red, second is Green, third is Blue, fourth is Alpha.
    pixels.data[i] = pixels.data[i] + 100  // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50  // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5  // blue
  }

  return pixels
}

function RGBSplit (pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {  // '4', because first is Red, second is Green, third is Blue, fourth is Alpha.
    pixels.data[i - 150] = pixels.data[i]  // '-150' is pixels back in array, set to current value red.
    pixels.data[i + 100] = pixels.data[i + 1]  // '+100' is pixels forward in array, set to curent value green.
    pixels.data[i - 150] = pixels.data[i + 2]  // '-150' is pixels back in arrayb, set to current value blue.
  }

  return pixels
}

function greenScreen (pixels) {
  const levels = {}

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value
  })

  for (let i = 0; i < pixels.data.length; i += 4) {
    let red = pixels.data[i + 0]
    let green = pixels.data[i + 1]
    let blue = pixels.data[i + 2]

    if (red >= levels.rmin && green >= levels.gmin && blue >= levels.bmin && red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax) {
      pixels.data[i + 3] = 0  // Sets alpha to 0, which is transparent (255 is opaque).
    }
  }

  return pixels
}

function takePhoto () {
  snap.currentTime = 0
  snap.play()

  // Take data out of canvas.
  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')

  link.href = data
  link.setAttribute('download', 'photo')
  link.innerHTML = `<img src="${data}" alt="Photo taken from device camera." />`
  strip.insertBefore(link, strip.firstChild)
}

getVideo()

takePhotoButton.addEventListener('click', takePhoto)
video.addEventListener('canplay', paintToCanavas)
