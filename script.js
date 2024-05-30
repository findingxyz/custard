function Timer(interval, started, elapsed) {
    this.interval = interval || null;
    this.started = started || null;
    this.elapsed = elapsed || 0;
}

const windowTemplate = document.createElement('template');
windowTemplate.innerHTML =
`<div class="window" tabindex="0">
    <div class="content">
        <div class="stopwatch">
            <h1 class="name">0</h1>
            <span class="time">00:00:00.00</span>
        </div>
    </div>
</div>`;
const windowNode = windowTemplate.content.children[0];

const cellTemplate = document.createElement('template');
cellTemplate.innerHTML =
`<div class="cell">
    <div class="container">
    </div>
</div>`;
const cellNode = cellTemplate.content.children[0];

const timers = new Map();

var windows = document.getElementsByClassName("window");

var selected = windows[0];

for (let i = 0; i < windows.length; i++) {
    const currentWindow = windows[i];
    currentWindow.addEventListener("mouseover", (event) => {
        changeSelectedWindow(currentWindow);
    });
    timers.set(currentWindow, new Timer());
}

document.addEventListener("keydown", (event) => {
    if (selected) {
        const timer = timers.get(selected);
        switch (event.key) {
            case "ArrowUp":
                // insert above
                selected.parentNode.parentNode.parentNode.insertBefore(createCell(), selected.parentNode.parentNode);
                break;
            case "ArrowDown":
                // insert below
                selected.parentNode.parentNode.parentNode.insertBefore(createCell(), selected.parentNode.parentNode.nextSibling);
                break;
            case "ArrowLeft":
                // insert to the left
                selected.parentNode.insertBefore(createWindow(timer, timer.interval), selected);
                if (timer.interval) toggleTimer(selected);
                break;
            case "ArrowRight":
                // insert to the right
                selected.parentNode.insertBefore(createWindow(timer, timer.interval), selected.nextSibling);
                if (timer.interval) toggleTimer(selected);
                break;
            case " ":
                toggleTimer(selected);
                break;
        }
    }
});

function changeSelectedWindow(newWindow) {
        selected.style.borderColor = null;
        selected.style.color = null;
        selected = newWindow;
        selected.style.borderColor = "#8cb4ff";
        selected.style.color = "white";
}

function createCell() {
    const newWindow = createWindow();
    const newCell = cellNode.cloneNode(true);
    newCell.childNodes[1].append(newWindow);
    return newCell;
}

function createWindow(spawnTimer, start) {
    const newWindow = windowNode.cloneNode(true);
    newWindow.addEventListener("mouseover", (event) => {
        changeSelectedWindow(newWindow);
    });
    const timer = (spawnTimer && spawnTimer.started) ? new Timer(null, new Date() - spawnTimer.elapsed, new Date() - spawnTimer.started) : new Timer();
    timers.set(newWindow, timer);
    newWindow.getElementsByClassName("name")[0].innerHTML = String(1 + document.getElementsByClassName("window").length);
    newWindow.getElementsByClassName("time")[0].innerHTML = displayTime(spawnTimer ? spawnTimer.elapsed : 0);
    if (start) toggleTimer(newWindow);
    return newWindow;
}

function toggleTimer(stopwatch) {
    let timer = timers.get(stopwatch);
    if (timer.interval) {
        clearInterval(timer.interval);
        timer.elapsed = new Date().getTime() - timer.started;
        timer.interval = null;
    } else {
        timer.started = new Date().getTime() - timer.elapsed;
        timer.interval = setInterval(update, 10, timer, stopwatch);
    }
}

function update(timer, stopwatch) {
    var now = new Date().getTime();
    var elapsed = now - timer.started;
    stopwatch.getElementsByClassName("time")[0].innerHTML = displayTime(elapsed);

}

function displayTime(elapsed) {
    var milliseconds = Math.floor(elapsed % 1000 / 10); // show only two digits, for aesthetic reasons
    var seconds = Math.floor(elapsed / 1000) % 60;
    var minutes = Math.floor(elapsed / 1000 / 60) % 60;
    var hours = Math.floor(elapsed / 1000 / 60 / 60);
    return pad10s(hours) + ":" + pad10s(minutes) + ":" + pad10s(seconds) + ":" + pad10s(milliseconds);
}

function pad10s(number) {
    return (number < 10 ? "0" : "") + number;
}
