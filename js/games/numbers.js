// Preloader + Music

const bgNumbersMusic = new Audio("assets/sounds/numbers-theme.mp3");
bgNumbersMusic.loop = true;
bgNumbersMusic.volume = 0.3;

import "../components/preloader.js";

// Functions

import { increaseMusicVolume } from "../components/music.js";

import { playDialogSound } from "../components/dialog.js";

import { getCodeDigit } from "../data/code.js";

import { completeGame } from "../progress.js";

// numbers Dialog Box
const numbersDialogText = document.getElementById("numbersDialog-text");
const numbersCatSprite = document.getElementById("numbersCat-sprite");
const numbersNextBtn = document.getElementById("numbersNext-btn");
const numbersDialog = document.getElementById("numbersDialog");
const numbersTip = document.getElementById("dialogTip");
const fisrtCodeNum = document.getElementById("firstCodeNum");
const secondCodeNum = document.getElementById("secondCodeNum");
const thirdCodeNum = document.getElementById("thirdCodeNum");

const numbersDialogs = [
  {
    text: "Поиграем в “Что это за число”? Это одна из моих любимых игр!",
    sprite: "images/cat-dialog-1.png",
    sound: ""
  },
  {
    text: "Перетащи числа из рамки в подходящий ему контур.",
    sprite: "",
    sound: ""
  }
];

let playerName = localStorage.getItem("playerName") || "котёнок";
let currentNumbersDialog = 0;
let firstNumbersDialogPlayed = false;

function showNumbersDialog(step) {
  numbersCatSprite.src = numbersDialogs[step].sprite;
  numbersDialogText.textContent = numbersDialogs[step].text.replace("{name}", playerName);
}

showNumbersDialog(currentNumbersDialog)

numbersNextBtn.onclick = async () => {

  if (currentNumbersDialog === 0 && !firstNumbersDialogPlayed) {
    firstNumbersDialogPlayed = true;
    numbersTip.classList.add("visually-hidden");
    bgNumbersMusic.volume = 0.1;
    bgNumbersMusic.play().catch(() => { });
    // numbersNextBtn.disabled = true;
    await playDialogSound(currentNumbersDialog);
    // numbersNextBtn.disabled = false;
    return;
  }

  if (currentNumbersDialog === 0) {
    numbersCatSprite.classList.add("visually-hidden");
    numbersDialogText.classList.add("dialog-box__text--small");
  }

  if (currentNumbersDialog >= numbersDialogs.length - 1) {
    numbersDialog.style.display = "none";
    increaseMusicVolume(bgNumbersMusic, 0.8);
    return;
  }

  currentNumbersDialog++;
  showNumbersDialog(currentNumbersDialog);
  // numbersNextBtn.disabled = true;
  await playDialogSound(currentNumbersDialog);
  // numbersNextBtn.disabled = false;
};

const correctSound = new Audio("assets/sounds/correct-sound.mp3")
const wrongSound = new Audio("assets/sounds/wrong-sound.mp3")
const victorySound = new Audio("assets/sounds/victory-sound.mp3")
const game = document.getElementById("result");

correctSound.volume = 0.4;
wrongSound.volume = 0.8;
victorySound.volume = 0.8;

// Numbers Game

const numbers = document.querySelectorAll(".game__number");
const contours = document.querySelectorAll(".game__contour-num");

const coloredNumbers = {
  1: document.querySelector(".game__colored-contour-num--1"),
  3: document.querySelector(".game__colored-contour-num--3"),
  7: document.querySelector(".game__colored-contour-num--7"),
  9: document.querySelector(".game__colored-contour-num--9")
};

let completedNumbers = 0;

let draggedNumber = null;
let dragClone = null;

numbers.forEach((number) => {
  number.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    draggedNumber = number;

    number.setPointerCapture(event.pointerId);

    dragClone = number.cloneNode(true);

    dragClone.style.position = "fixed";
    dragClone.style.zIndex = "100";
    dragClone.style.pointerEvents = "none";
    dragClone.style.width = `${number.offsetWidth}px`;

    document.body.appendChild(dragClone);

    moveDragClone(event);
  });

  number.addEventListener("pointermove", (event) => {
    if (!draggedNumber) return;

    moveDragClone(event);
  });

  number.addEventListener("pointerup", (event) => {
    if (!draggedNumber) return;

    const elementUnderPointer = document.elementFromPoint(
      event.clientX,
      event.clientY
    );

    const contour = elementUnderPointer?.closest(".game__contour-num");

    if (contour) {
      checkAnswer(contour, draggedNumber);
    }

    finishDrag();
  });

  number.addEventListener("pointercancel", () => {
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
  draggedNumber = null;
}

function checkAnswer(contour, number) {
  const correctNumber = Number(
    contour.id.replace("contour-", "")
  );

  const selectedNumber = Number(number.dataset.number);

  if (selectedNumber === correctNumber) {
    correctSound.currentTime = 0;
    correctSound.play();

    contour.classList.add("visually-hidden");
    coloredNumbers[selectedNumber].classList.remove("visually-hidden");

    completedNumbers++;

    if (completedNumbers === 4) {
      completeGame(3);

      fisrtCodeNum.textContent = getCodeDigit(0);
      secondCodeNum.textContent = getCodeDigit(1);
      thirdCodeNum.textContent = getCodeDigit(2);

      victorySound.play();
      game.classList.remove("visually-hidden");
    }

    return;
  }

  wrongSound.currentTime = 0;
  wrongSound.play();
}