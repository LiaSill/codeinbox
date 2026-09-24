// Preloader + Music

const bgHouseMusic = new Audio("assets/sounds/houses-theme.mp3");
bgHouseMusic.loop = true;
bgHouseMusic.volume = 0.3;

import "../components/preloader.js";

// Functions

import { increaseMusicVolume } from "../components/music.js";

import { playDialogSound } from "../components/dialog.js";

import { getCodeDigit } from "../data/code.js";

import { completeGame } from "../progress.js";

// house Dialog Box
const houseDialogText = document.getElementById("houseDialog-text");
const houseCatSprite = document.getElementById("houseCat-sprite");
const houseNextBtn = document.getElementById("houseNext-btn");
const houseDialog = document.getElementById("houseDialog");
const houseTip = document.getElementById("dialogTip");
const fisrtCodeNum = document.getElementById("firstCodeNum");
const secondCodeNum = document.getElementById("secondCodeNum");

const houseDialogs = [
  {
    text: "Мама учит меня считать! Сегодня она дала мне домашнее задание.",
    sprite: "images/cat-dialog-4.png",
    sound: ""
  },
  {
    text: "Можешь помочь мне решить все домики, {name}?",
    sprite: "images/cat-dialog-2.png",
    sound: ""
  },
  {
    text: "Помоги Рудису решить примеры в домиках!",
    sprite: "",
    sound: ""
  },
  {
    text: "Перетащи в окошки числа из рамки, чтобы получилось число на крыше.",
    sprite: "",
    sound: ""
  }
];

let playerName = localStorage.getItem("playerName") || "котёнок";
let currentHouseDialog = 0;
let firstHouseDialogPlayed = false;

function showHouseDialog(step) {
  houseCatSprite.src = houseDialogs[step].sprite;
  houseDialogText.textContent = houseDialogs[step].text.replace("{name}", playerName);
}

showHouseDialog(currentHouseDialog)

houseNextBtn.onclick = async () => {

  if (currentHouseDialog === 0 && !firstHouseDialogPlayed) {
    firstHouseDialogPlayed = true;
    houseTip.classList.add("visually-hidden");
    bgHouseMusic.volume = 0.1;
    bgHouseMusic.play().catch(() => { });
    // houseNextBtn.disabled = true;
    await playDialogSound(currentHouseDialog);
    // houseNextBtn.disabled = false;
    return;
  }

  if (currentHouseDialog === 1 || currentHouseDialog === 2) {
    houseCatSprite.classList.add("visually-hidden");
    houseDialogText.classList.add("dialog-box__text--small");
  }

  if (currentHouseDialog >= houseDialogs.length - 1) {
    houseDialog.style.display = "none";
    increaseMusicVolume(bgHouseMusic, 0.9);
    return;
  }

  currentHouseDialog++;
  showHouseDialog(currentHouseDialog);
  // houseNextBtn.disabled = true;
  await playDialogSound(currentHouseDialog);
  // houseNextBtn.disabled = false;
};

// House Game

const correctSound = new Audio("assets/sounds/correct-sound.mp3")
const wrongSound = new Audio("assets/sounds/wrong-sound.mp3")
const victorySound = new Audio("assets/sounds/victory-sound.mp3")
const game = document.getElementById("result");

const houses = document.getElementById("houses");
const house1 = document.querySelector(".game__house-1");
const house2 = document.querySelector(".game__house-2");

const numbers = document.querySelectorAll(".game__number");

const blanks = document.querySelectorAll(".game__floor-1-blank, .game__floor-2-blank");

correctSound.volume = 0.4;
wrongSound.volume = 0.8;
victorySound.volume = 0.8;

const correctAnswers = {
  resultH1F1: 4,
  resultH1F2: 2,
  resultH2F1: 5,
  resultH2F2: 3,
  resultH2F3: 3
};

let completedFloors = 0;

function checkHouseProgress() {
  if (completedFloors === 2) {
    house1.classList.add("visually-hidden");
    house2.classList.remove("visually-hidden");
  }

  if (completedFloors === 5) {
    completeGame(2);

    fisrtCodeNum.textContent = getCodeDigit(0);
    secondCodeNum.textContent = getCodeDigit(1);

    victorySound.play();

    game.classList.remove("visually-hidden");
  }
}

function checkAnswer(blank, number) {
  const correctAnswer = correctAnswers[blank.id];

  if (Number(number.dataset.number) === correctAnswer) {
    correctSound.currentTime = 0;
    correctSound.play();

    blank.classList.add("visually-hidden");

    completedFloors++;

    checkHouseProgress();

    return;
  }

  blank.classList.add("game__blank--wrong");
      setTimeout(() => {
        blank.classList.remove("game__blank--wrong");
      }, 1000);
  wrongSound.currentTime = 0;
  wrongSound.play();
}

// Drag & Drop

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

    const blank = elementUnderPointer?.closest(
      ".game__floor-1-blank, .game__floor-2-blank"
    );

    if (blank) {
      checkAnswer(blank, draggedNumber);
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