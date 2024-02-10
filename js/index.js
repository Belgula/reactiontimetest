let testStarted = false
let startTime = null
let finishTime = null
let timer = null
let trialCount = 0
let successfulClicks = 0
const reactionTimes = [];

const clickarea = document.querySelector('.clickarea')
const message = document.querySelector('.message')
const note = document.querySelector('.note')

const randomNumber = (min, max, int = false) => {
  return (int)
    ? Math.floor(Math.random() * (max - min + 1)) + min
    : Math.random() * (max - min) + min
}

const updateText = (messageText, noteText) => {
  message.textContent = messageText
  note.textContent = noteText
}

const handleClick = event => {
  event.preventDefault()
  event.stopPropagation()

  if (trialCount < 5) {
    if (!testStarted) {
      const msUntilGreen = randomNumber(2, 4)
      startTime = new Date()
      finishTime = new Date(startTime.getTime() + (msUntilGreen * 1000))

      clickarea.classList.add('red')
      updateText('Tunggu lampu hijau...', '')
      testStarted = true

      timer = setTimeout(() => {
        clickarea.classList.remove('red')
        clickarea.classList.add('green')
        message.textContent = 'Klik!'
      }, msUntilGreen * 1000)
    } else {
      testStarted = false
      trialCount++

      if (new Date() < finishTime) {
        clearTimeout(timer)
        clickarea.classList.remove('red')
        updateText('Terlalu cepat!', 'Klik untuk mencoba lagi')
      } else {
        successfulClicks++
        const reactionTime = new Date() - finishTime;
        reactionTimes.push(reactionTime);

        clickarea.classList.remove('green')
        updateText(`${new Date() - finishTime}ms`, `Klik untuk melanjutkan - Percobaan ${trialCount}`)
      }
    }
  } else {
    const averageReactionTime = reactionTimes.reduce((acc, time) => acc + time, 0) / reactionTimes.length;

    let resultText = '';
    if (averageReactionTime >= 150 && averageReactionTime <= 240) {
      resultText = 'Normal';
    } else if (averageReactionTime > 240 && averageReactionTime <= 410) {
      resultText = 'Kelelahan Ringan';
    } else if (averageReactionTime > 410 && averageReactionTime <= 580) {
      resultText = 'Kelelahan Sedang';
    } else {
      resultText = 'Kelelahan Berat';
    }

    updateText(`Rata-rata Waktu Reaksi: ${averageReactionTime.toFixed(2)}ms - ${resultText}`, 'Test selesai');
    clickarea.removeEventListener('mousedown', handleClick);
    clickarea.removeEventListener('touchstart', handleClick);
  }
}

clickarea.addEventListener('mousedown', handleClick)
clickarea.addEventListener('touchstart', handleClick)
