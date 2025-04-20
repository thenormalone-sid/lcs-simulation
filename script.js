let matrix = [];
let arrows = [];
let i = 0, j = 0, step = 0;
let playing = false;
let interval;
let lcsStr = "";
let soundEnabled = true;

const matchSound = document.getElementById("matchSound");
const fillSound = document.getElementById("fillSound");
const traceSound = document.getElementById("traceSound");

const string1Input = document.getElementById("string1");
const string2Input = document.getElementById("string2");
const startBtn = document.getElementById("start");
const nextBtn = document.getElementById("nextStep");
const playPauseBtn = document.getElementById("playPause");
const resetBtn = document.getElementById("reset");
const muteBtn = document.getElementById("muteToggle");
const gridContainer = document.getElementById("gridContainer");
const controls = document.getElementById("controls");
const lcsOutput = document.getElementById("lcsOutput");

startBtn.addEventListener("click", () => {
  const str1 = string1Input.value.trim();
  const str2 = string2Input.value.trim();
  if (!str1 || !str2) return alert("Enter both strings.");
  initGrid(str1, str2);
});

nextBtn.addEventListener("click", () => runStep());
playPauseBtn.addEventListener("click", togglePlay);
resetBtn.addEventListener("click", reset);
muteBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  muteBtn.textContent = soundEnabled ? "🔊" : "🔇";
});

function initGrid(a, b) {
  clearGrid();
  i = j = step = 0;
  lcsStr = "";
  matrix = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(0));
  arrows = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(""));

  gridContainer.style.gridTemplateColumns = `repeat(${a.length + 2}, 40px)`;

  for (let r = 0; r <= b.length + 1; r++) {
    for (let c = 0; c <= a.length + 1; c++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";

      if (r === 0 && c === 0) {
        cell.textContent = "";
      } else if (r === 0 && c > 1) {
        cell.textContent = a[c - 2];
        cell.style.fontWeight = "bold";
      } else if (c === 0 && r > 1) {
        cell.textContent = b[r - 2];
        cell.style.fontWeight = "bold";
      } else if (r > 0 && c > 0) {
        const gridR = r - 1;
        const gridC = c - 1;
        cell.id = `cell-${gridR}-${gridC}`;
      }

      gridContainer.appendChild(cell);
    }
  }

  controls.classList.remove("hidden");
  lcsOutput.classList.add("hidden");
  runStep();
}

function runStep() {
  const a = string1Input.value;
  const b = string2Input.value;

  if (i >= b.length + 1) {
    stop();
    traceLCS(a, b);
    return;
  }

  const cell = document.getElementById(`cell-${i}-${j}`);
  if (cell) cell.classList.remove("match", "trace");

  if (i === 0 || j === 0) {
    matrix[i][j] = 0;
    arrows[i][j] = "";
  } else if (b[i - 1] === a[j - 1]) {
    matrix[i][j] = matrix[i - 1][j - 1] + 1;
    arrows[i][j] = "diagonal";
    if (soundEnabled) matchSound.play();
    if (cell) cell.classList.add("match");
  } else {
    if (matrix[i - 1][j] >= matrix[i][j - 1]) {
      matrix[i][j] = matrix[i - 1][j];
      arrows[i][j] = "up";
    } else {
      matrix[i][j] = matrix[i][j - 1];
      arrows[i][j] = "left";
    }
    if (soundEnabled) fillSound.play();
  }

  if (cell) {
    cell.textContent = matrix[i][j];
    if (arrows[i][j]) addArrow(cell, arrows[i][j]);
  }

  j++;
  if (j > string1Input.value.length) {
    i++;
    j = 0;
  }
}

function addArrow(cell, dir) {
  const arrow = document.createElement("div");
  arrow.className = `arrow ${dir}`;
  arrow.textContent = dir === "diagonal" ? "↖" : dir === "left" ? "←" : "↑";
  cell.appendChild(arrow);
}

function togglePlay() {
  if (playing) {
    stop();
  } else {
    playing = true;
    playPauseBtn.textContent = "Pause";
    interval = setInterval(() => runStep(), 400);
  }
}

function stop() {
  playing = false;
  clearInterval(interval);
  playPauseBtn.textContent = "Play";
}

function reset() {
  stop();
  gridContainer.innerHTML = "";
  lcsOutput.innerHTML = "";
  controls.classList.add("hidden");
}

function clearGrid() {
  gridContainer.innerHTML = "";
}

function traceLCS(a, b) {
  let x = b.length, y = a.length;
  let result = "";

  while (x > 0 && y > 0) {
    const cell = document.getElementById(`cell-${x}-${y}`);
    if (cell) cell.classList.add("trace");
    if (soundEnabled) traceSound.play();

    if (a[y - 1] === b[x - 1]) {
      result = a[y - 1] + result;
      x--;
      y--;
    } else if (matrix[x - 1][y] >= matrix[x][y - 1]) {
      x--;
    } else {
      y--;
    }
  }

  lcsOutput.textContent = `LCS: ${result}`;
  lcsOutput.classList.remove("hidden");
}
