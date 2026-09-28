// Preloader + Music

const bgColoringMusic = new Audio("assets/sounds/coloring-theme.mp3");
bgColoringMusic.loop = true;
bgColoringMusic.volume = 0.3;

import "../components/preloader.js";

// Functions

import { increaseMusicVolume } from "../components/music.js";

import { playDialogSound } from "../components/dialog.js";

import { getCodeDigit } from "../data/code.js";

import { completeGame } from "../progress.js";

// coloring Dialog Box
const coloringDialogText = document.getElementById("coloringDialog-text");
const coloringCatSprite = document.getElementById("coloringCat-sprite");
const coloringNextBtn = document.getElementById("coloringNext-btn");
const coloringDialog = document.getElementById("coloringDialog");
const coloringTip = document.getElementById("dialogTip");
const fisrtCodeNum = document.getElementById("firstCodeNum");
const secondCodeNum = document.getElementById("secondCodeNum");
const thirdCodeNum = document.getElementById("thirdCodeNum");
const fourthCodeNum = document.getElementById("fourthCodeNum");

const coloringDialogs = [
  {
    text: "Любишь раскраски? А я их обожаю!",
    sprite: "images/cat-dialog-2.png",
    sound: ""
  },
  {
    text: "Эти картинки нарисовала моя мама.\nДавай раскрасим вместе!",
    sprite: "images/cat-dialog-4.png",
    sound: ""
  },
  {
    text: "Раскрась картинки так же, как и фигуры, из которых они сделаны.",
    sprite: "",
    sound: ""
  },
  {
    text: "Подсказка: перетащи цвета на фигуры.",
    sprite: "",
    sound: ""
  }
];

let playerName = localStorage.getItem("playerName") || "котёнок";
let currentColoringDialog = 0;
let firstColoringDialogPlayed = false;

function showColoringDialog(step) {
  coloringCatSprite.src = coloringDialogs[step].sprite;
  coloringDialogText.textContent = coloringDialogs[step].text.replace("{name}", playerName);
}

showColoringDialog(currentColoringDialog)

coloringNextBtn.onclick = async () => {

  if (currentColoringDialog === 0 && !firstColoringDialogPlayed) {
    firstColoringDialogPlayed = true;
    coloringTip.classList.add("visually-hidden");
    bgColoringMusic.volume = 0.1;
    bgColoringMusic.play().catch(() => { });
    // coloringNextBtn.disabled = true;
    await playDialogSound(currentColoringDialog);
    // coloringNextBtn.disabled = false;
    return;
  }

  if (currentColoringDialog === 0) {
    coloringDialogText.classList.add("dialog-box__text--small");
  }

  if (currentColoringDialog === 1 || currentColoringDialog === 2) {
    coloringCatSprite.classList.add("visually-hidden");
    coloringDialogText.classList.add("dialog-box__text--small");
  }

  if (currentColoringDialog >= coloringDialogs.length - 1) {
    coloringDialog.style.display = "none";
    increaseMusicVolume(bgColoringMusic, 0.7);
    return;
  }

  currentColoringDialog++;
  showColoringDialog(currentColoringDialog);
  // coloringNextBtn.disabled = true;
  await playDialogSound(currentColoringDialog);
  // coloringNextBtn.disabled = false;
};

const correctSound = new Audio("assets/sounds/correct-sound.mp3")
const wrongSound = new Audio("assets/sounds/wrong-sound.mp3")
const victorySound = new Audio("assets/sounds/victory-sound.mp3")
const game = document.getElementById("result");

correctSound.volume = 0.4;
wrongSound.volume = 0.8;
victorySound.volume = 0.8;

// Coloring game

const figures = document.querySelectorAll(".game__figure");
const figureButtons = document.querySelectorAll(".game__figure-btn");

let currentFigure = document.querySelector(".game__figure--1");
let completedColors = 0;

let draggedFigure = null;
let dragClone = null;

const figureBlankCounts = [
  document.querySelectorAll(".game__figure--1 [id$='-blank']").length,
  document.querySelectorAll(".game__figure--2 [id$='-blank']").length,
  document.querySelectorAll(".game__figure--3 [id$='-blank']").length
];

const HIDE_DELAY = 2000;

let currentFigureNumber = 1;

// Drag and drop

figureButtons.forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    draggedFigure = button;

    button.setPointerCapture(event.pointerId);

    dragClone = button.cloneNode(true);

    dragClone.style.position = "fixed";
    dragClone.style.zIndex = "100";
    dragClone.style.pointerEvents = "none";
    dragClone.style.width = `${button.offsetWidth}px`;

    document.body.appendChild(dragClone);

    moveDragClone(event);
  });

  button.addEventListener("pointermove", (event) => {
    if (!draggedFigure) return;

    moveDragClone(event);
  });

  button.addEventListener("pointerup", (event) => {
    if (!draggedFigure) return;

    const elementUnderPointer = document.elementFromPoint(
      event.clientX,
      event.clientY
    );

    const blank = elementUnderPointer?.closest(
      '[id$="-blank"]'
    );

    if (blank) {
      checkAnswer(blank, draggedFigure);
    }

    finishDrag();
  });

  button.addEventListener("pointercancel", () => {
    finishDrag();
  });
});


function moveDragClone(event) {
  if (!dragClone) return;

  dragClone.style.left =
    `${event.clientX - dragClone.offsetWidth / 2}px`;

  dragClone.style.top =
    `${event.clientY - dragClone.offsetHeight / 2}px`;
}


function finishDrag() {
  if (dragClone) {
    dragClone.remove();
  }

  dragClone = null;
  draggedFigure = null;
}

const correctColors = {
  "1-yellow-blank": "sunny-yellow",
  "1-top-red-blank": "red",
  "1-bottom-red-blank": "red",
  "1-top-side-red-blank": "red",
  "1-bottom-side-red-blank": "red",
  "1-blue-blank": "dark-blue",

  "2-beige-blank": "beige",
  "2-bottom-brown-blank": "brown",
  "2-top-brown-blank": "brown",
  "2-green-blank": "green",
  "2-left-blue-blank": "blue",
  "2-middle-blue-blank": "blue",
  "2-right-blue-blank": "blue",

  "3-bottom-left-blue-blank": "light-blue",
  "3-left-blue-blank": "light-blue",
  "3-top-left-blue-blank": "light-blue",
  "3-top-blue-blank": "light-blue",
  "3-top-right-blue-blank": "light-blue",
  "3-right-blue-blank": "light-blue",
  "3-bottom-right-blue-blank": "light-blue",

  "3-yellow-blank": "yellow",
  "3-salad-blank": "light-green",
  "3-right-green-blank": "dark-green",
  "3-left-green-blank": "dark-green"
};

function checkFigureComplete() {
  const currentFigure = document.querySelector(
    `.game__figure--${currentFigureNumber}`
  );

  const blanksLeft = currentFigure.querySelectorAll(
    '[id$="-blank"]:not(.visually-hidden)'
  );

  if (blanksLeft.length !== 0) {
    return;
  }

  setTimeout(() => {
    // Скрываем текущую картинку
    currentFigure.classList.add("visually-hidden");

    // Скрываем текущий набор цветов
    const currentColors = document.querySelector(
      `.game__colors--${currentFigureNumber}`
    );

    currentColors.classList.add("visually-hidden");

    // Если это была последняя картинка
    if (currentFigureNumber === 3) {
      completeGame(4);

      fisrtCodeNum.textContent = getCodeDigit(0);
      secondCodeNum.textContent = getCodeDigit(1);
      thirdCodeNum.textContent = getCodeDigit(2);
      fourthCodeNum.textContent = getCodeDigit(3);

      victorySound.play();
      game.classList.remove("visually-hidden");

      return;
    }

    // Переходим к следующей картинке
    currentFigureNumber++;

    const nextFigure = document.querySelector(
      `.game__figure--${currentFigureNumber}`
    );

    const nextColors = document.querySelector(
      `.game__colors--${currentFigureNumber}`
    );

    nextFigure.classList.remove("visually-hidden");
    nextColors.classList.remove("visually-hidden");
  }, HIDE_DELAY);
}

function checkAnswer(blank, number) {
  const correctColor = correctColors[blank.id];
  const selectedColor = number.dataset.color;

  if (selectedColor === correctColor) {
    correctSound.currentTime = 0;
    correctSound.play();

    blank.classList.add("visually-hidden");

    checkFigureComplete();

    return;
  }

  wrongSound.currentTime = 0;
  wrongSound.play();
}