import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');

startBtn.disabled = true;

let selectedDate = null;
let timerId = null;

const timerElements = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];

    if (date <= new Date()) {
      startBtn.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
      });
      return;
    }

    selectedDate = date;
    startBtn.disabled = false;
  },
});

startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  startBtn.disabled = true;
  dateInput.disabled = true;
  startCountdown();
}

function startCountdown() {
  timerId = setInterval(() => {
    const deltaTime = selectedDate - new Date();

    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      dateInput.disabled = false;
      startBtn.disabled = true;

      iziToast.success({
        message: 'Countdown finished!',
      });
      return;
    }

    updateTimerDisplay(convertMs(deltaTime));
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  timerElements.days.textContent = addLeadingZero(days);
  timerElements.hours.textContent = addLeadingZero(hours);
  timerElements.minutes.textContent = addLeadingZero(minutes);
  timerElements.seconds.textContent = addLeadingZero(seconds);
}
