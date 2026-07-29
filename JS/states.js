//state of the tree
const states = {
    IDLE: 'idle',
    GROWING: 'growing',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    BREAK: 'break'
};

let currentState = states.IDLE;

function transitionState(newState) {
    console.log(`${currentState} -> ${newState}`);
    currentState = newState;
}
