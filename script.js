const $ = id => document.getElementById(id);
const d = {
    min: $('timeMinutes'), sec: $('timeSeconds'), ms: $('timeMs'),
    lapsList: $('lapsList'), lapsCount: $('lapsCount'), statLaps: $('statLaps'),
    startBtn: $('startPauseBtn'), lapBtn: $('lapBtn'), resetBtn: $('resetBtn'), statusDot: $('statusDot')
};

let timer, elapsed = 0, lapStart = 0, running = false, laps = [];

const pad = n => String(Math.floor(n)).padStart(2, '0');
const format = t => `${pad(t / 60000)}:${pad((t % 60000) / 1000)}.${pad((t % 1000) / 10)}`;

function update() {
    d.min.textContent = pad(elapsed / 60000);
    d.sec.textContent = pad((elapsed % 60000) / 1000);
    d.ms.textContent = pad((elapsed % 1000) / 10);
}

function updateCount() {
    d.statLaps.textContent = laps.length;
    d.lapsCount.textContent = `${laps.length} lap${laps.length !== 1 ? 's' : ''}`;
}

function start() {
    let startT = Date.now() - elapsed;
    timer = setInterval(() => { elapsed = Date.now() - startT; update(); }, 10);
    running = true;
    d.startBtn.textContent = 'Pause';
    d.startBtn.className = 'btn btn-start running';
    d.lapBtn.disabled = d.resetBtn.disabled = false;
    d.statusDot.className = 'status-dot running';
}

function pause() {
    clearInterval(timer);
    running = false;
    d.startBtn.textContent = 'Resume';
    d.startBtn.className = 'btn btn-start';
    d.lapBtn.disabled = true;
    d.statusDot.className = 'status-dot paused';
}

function reset() {
    clearInterval(timer);
    running = elapsed = lapStart = laps.length = 0;
    update();
    updateCount();
    d.lapsList.innerHTML = '<li class="laps-empty">No laps yet</li>';
    d.startBtn.textContent = 'Start';
    d.startBtn.className = 'btn btn-start';
    d.lapBtn.disabled = d.resetBtn.disabled = true;
    d.statusDot.className = 'status-dot';
}

function lap() {
    if (d.lapsList.querySelector('.laps-empty')) d.lapsList.innerHTML = '';
    
    let currentLapTime = elapsed - lapStart;
    laps.unshift({ num: laps.length + 1, lap: currentLapTime });
    lapStart = elapsed;
    
    const li = document.createElement('li');
    li.className = 'lap-item';
    li.innerHTML = `<span class="lap-n">${pad(laps.length)}</span>
                    <span class="lap-split">${format(currentLapTime)}</span>`;
    d.lapsList.prepend(li);
    
    updateCount();
}

d.startBtn.onclick = () => running ? pause() : start();
d.lapBtn.onclick = lap;
d.resetBtn.onclick = reset;

document.onkeydown = e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); running ? pause() : start(); }
    if (e.code === 'KeyL' && !d.lapBtn.disabled) lap();
    if (e.code === 'KeyR' && !d.resetBtn.disabled) reset();
};

update();
