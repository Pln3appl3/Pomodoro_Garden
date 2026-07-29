let intervalId = null;
let secondsRemaining = 25*60;

function tick() {
    if (currentState !== states.GROWING && currentState !== states.BREAK) return;

    secondsRemaining--;
    updateDisplay();

    if (secondsRemaining <= 0) {
        clearInterval(intervalId);
        intervalId = null;

        if (currentState === states.GROWING) {
            pomodoroCount++;
            updateCounters();
            secondsRemaining = Number(document.getElementById('breakDuration').value) * 60;
            transitionState(states.BREAK);
            intervalId = setInterval(tick, 1000);
        } else if (currentState === states.BREAK) {
            breakCount++;
            updateCounters();
            transitionState(states.IDLE);
        } 
    }
}

function updateDisplay() {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    document.getElementById('minutes').textContent = String(mins).padStart(2, '0');
    document.getElementById('seconds').textContent = String(secs).padStart(2, '0');
}

let pomodoroCount = 0;
let breakCount = 0;

function updateCounters(){
    document.getElementById("pomodoros").textContent = pomodoroCount;
    document.getElementById("breaks").textContent = breakCount;
}