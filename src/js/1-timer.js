import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('[data-start]');
startButton.disabled = true;
const dateTimePicker = document.querySelector('#datetime-picker');
let userSelectedDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    const currentDate = new Date();
    if (userSelectedDate <= currentDate) {
      iziToast.error({   
        title: 'Error',
        message: 'Please choose a date in the future'}
      )
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};
flatpickr("#datetime-picker", options);

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  dateTimePicker.disabled = true;
  intervalId = setInterval(() => {
    const newEndDate = userSelectedDate.getTime()
    const newDiff = newEndDate - new Date().getTime();
    if (newDiff <= 0) {
      clearInterval(intervalId);
      updateTimer(0);
      return;
    }
    updateTimer(newDiff)
  }, 1000
  );
  
})

function updateTimer(newDiff) {
  const { days, hours, minutes, seconds } = convertMs(newDiff);
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

function convertMs(ms) {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

 
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
   return String(value).padStart(2, "0");
}
