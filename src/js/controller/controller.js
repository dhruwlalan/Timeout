import dom from '../views/dom';
import Timeout from '../models/Timeout';
import * as timeoutView from '../views/timeoutView';
import * as theme from '../views/theme';

let minutes = 0;
let seconds = 0;

const updateMinutes = () => {
   let min = timeoutView.getMinutesInput();
   min = min > 300 ? 300 : Math.floor(min);
   min = min < 0 ? 0 : Math.floor(min);
   timeoutView.setMinutesInput(min);
   Timeout.minutes = min;
   minutes = min;
   timeoutView.updateTimer('minutes', min);
};
const updateSeconds = () => {
   let sec = timeoutView.getSecondsInput();
   sec = sec > 59 ? 59 : Math.floor(sec);
   sec = sec < 0 ? 0 : Math.floor(sec);
   timeoutView.setSecondsInput(sec);
   Timeout.seconds = sec;
   seconds = sec;
   timeoutView.updateTimer('seconds', sec);
};
const resetTimer = () => {
   Timeout.minutes = 0;
   Timeout.seconds = 0;
   Timeout.timerId = 0;
   minutes = 0;
   seconds = 0;
   timeoutView.reset();
};
const timeout = () => {
   clearInterval(Timeout.timerId);
   resetTimer();
   dom.header.classList.add('heartBeat');
   setTimeout(() => {
      dom.header.classList.remove('heartBeat');
   }, 3100);
};
const startTimer = () => {
   timeoutView.start();
   Timeout.timerId = setInterval(() => {
      seconds--;
      if (seconds < 0) {
         if (minutes === 0) {
            timeout();
            return;
         }
         seconds = 59;
         minutes--;
      }
      timeoutView.updateTimer('minutes', minutes);
      timeoutView.updateTimer('seconds', seconds);
   }, 1000);
};
const stopTimer = () => {
   timeoutView.stop();
   clearInterval(Timeout.timerId);
   minutes = Timeout.minutes;
   seconds = Timeout.seconds;
   timeoutView.updateTimer('minutes', Timeout.minutes);
   timeoutView.updateTimer('seconds', Timeout.seconds);
};
const pauseTimer = () => {
   timeoutView.pause();
   clearInterval(Timeout.timerId);
};

const setupEventListeners = function () {
   dom.themeBtn.addEventListener('click', theme.changeTheme);
   dom.minutesInput.addEventListener('keyup', updateMinutes);
   dom.minutesInput.addEventListener('change', updateMinutes);
   dom.secondsInput.addEventListener('keyup', updateSeconds);
   dom.secondsInput.addEventListener('change', updateSeconds);
   dom.startBtn.addEventListener('click', startTimer);
   dom.stopBtn.addEventListener('click', stopTimer);
   dom.pauseBtn.addEventListener('click', pauseTimer);
   dom.resetBtn.addEventListener('click', resetTimer);
};
export default function () {
   timeoutView.init();
   const currentTheme = localStorage.getItem('timeoutTheme');
   if (currentTheme) {
      theme.updateTheme(currentTheme);
   } else {
      localStorage.setItem('timeoutTheme', 'light');
      theme.updateTheme('light');
   }
   setupEventListeners();
}
