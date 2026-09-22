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
    // houseNextBtn.disabled = true;
    bgHouseMusic.volume = 0.1;
    bgHouseMusic.play().catch(() => { });
    await playDialogSound(currentHouseDialog);
    // houseNextBtn.disabled = false;
    return;
  }

  if (currentHouseDialog === 1 || currentHouseDialog === 2) {
    houseCatSprite.classList.add("visually-hidden")
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
const game = document.getElementById("result")

correctSound.volume = 0.4;
wrongSound.volume = 0.8;
victorySound.volume = 0.8;

// completeGame(2);
// fisrtCodeNum.textContent = getCodeDigit(0);
// secondCodeNum.textContent = getCodeDigit(1);
// victorySound.play();
// game.classList.remove("visually-hidden");
