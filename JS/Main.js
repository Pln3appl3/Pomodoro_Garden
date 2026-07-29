function StartButton() {
    if (intervalId === null) { 
        if (currentState === states.IDLE) {
            secondsRemaining = Number(document.getElementById('workDuration').value) * 60;
            let treeShape = buildTree(-Math.PI / 2, 9, 9);
        }
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
    secondsRemaining = Number(document.getElementById('workDuration').value) * 60;
    updateDisplay();
}

function toggleSettings() {
    const settingsPanel = document.querySelector('.settings');
    settingsPanel.hidden = !settingsPanel.hidden;
}

function saveApiKey() {
    const key = document.getElementById('apiKey').value;
    if (key) {
        localStorage.setItem('weatherApiKey', key);
        updateWeather();
    }
}