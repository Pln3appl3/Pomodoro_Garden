let intervalId = null;
let secondsRemaining = 25*60;

function tick() {
    if (currentState !== states.GROWING) return;

    secondsRemaining--;
    updateDisplay();

    if (secondsRemaining <= 0) {
        clearInterval(intervalId);
        transitionState(states.COMPLETED);
    }
}

function updateDisplay() {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    document.getElementById('minutes').textContent = String(mins).padStart(2, '0');
    document.getElementById('seconds').textContent = String(secs).padStart(2, '0');
}