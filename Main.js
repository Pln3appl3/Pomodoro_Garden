function StartButton() {
    if (intervalId === null) { 
        intervalId = setInterval(tick, 1000);
    }
    transitionState(states.GROWING);
}

function PauseButton() {
    transitionState(states.PAUSED);
    clearInterval(intervalId);
    intervalId = null;
}

function ResetButton() {
    transitionState(states.IDLE);
    clearInterval(intervalId);
    intervalId = null;
    secondsRemaining = 25*60;
    updateDisplay();
}
