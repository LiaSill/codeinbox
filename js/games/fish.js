// Preloader + Music

const bgFishMusic = new Audio("assets/sounds/fish-theme.mp3");
bgFishMusic.loop = true;
bgFishMusic.volume = 0.3;

import "../components/preloader.js";

// Functions

import { increaseMusicVolume } from "../components/music.js";

import { playDialogSound } from "../components/dialog.js";

import { getCodeDigit } from "../data/code.js";

import { completeGame } from "../progress.js";

// Fish Dialog Box
const fishDialogText = document.getElementById("fishDialog-text");
const fishCatSprite = document.getElementById("fishCat-sprite");
const fishNextBtn = document.getElementById("fishNext-btn");
const fishDialog = document.getElementById("fishDialog");
const fishTip = document.getElementById("dialogTip");
const fisrtCodeNum = document.getElementById("firstCodeNum");

//"assets/sounds/dialog-1-audio(1).mp3"
const fishDialogs = [
  {
    text: "У меня дома есть аквариум!\nВ нём плавают красивые рыбки!",
    sprite: "images/cat-dialog-2.png",
    sound: ""
  },
  {
    text: "Но я постоянно забываю\nих количество...",
    sprite: "images/cat-dialog-5.png",
    sound: ""
  },
  {
    text: "Помоги Рудису посчитать рыбок!",
    sprite: "",
    sound: ""
  },
  {
    text: "Рудис оставил подсказку:\nЩёлкай по рыбкам от 1 до 10.",
    sprite: "",
    sound: ""
  }
];

let currentFishDialog = 0;
let firstFishDialogPlayed = false;

function showFishDialog(step) {
  fishCatSprite.src = fishDialogs[step].sprite;
  fishDialogText.textContent = fishDialogs[step].text;
}

showFishDialog(currentFishDialog)

fishNextBtn.onclick = async () => {

  if (currentFishDialog === 0 && !firstFishDialogPlayed) {
    firstFishDialogPlayed = true;
    fishTip.classList.add("visually-hidden");
    bgFishMusic.volume = 0.1;
    bgFishMusic.play().catch(() => { });
    // fishNextBtn.disabled = true;
    await playDialogSound(currentFishDialog);
    // fishNextBtn.disabled = false;
    return;
  }

  if (currentFishDialog === 1 || currentFishDialog === 2) {
    fishCatSprite.classList.add("visually-hidden")
  }

  if (currentFishDialog >= fishDialogs.length - 1) {
    fishDialog.style.display = "none";
    increaseMusicVolume(bgFishMusic, 0.9);
    return;
  }

  currentFishDialog++;
  showFishDialog(currentFishDialog);
  // fishNextBtn.disabled = true;
  await playDialogSound(currentFishDialog);
  // fishNextBtn.disabled = false;
};

// Fish Count Game

let currentFishNumber = 1;
const fishes = document.querySelectorAll(".game__fish");
const correctSound = new Audio("assets/sounds/correct-sound.mp3")
const wrongSound = new Audio("assets/sounds/wrong-sound.mp3")
const victorySound = new Audio("assets/sounds/victory-sound.mp3")
const game = document.getElementById("result")

correctSound.volume = 0.4;
wrongSound.volume = 0.8;
victorySound.volume = 0.8;

fishes.forEach(fish => {
  fish.addEventListener("click", () => {
    const number = Number(fish.dataset.number);
    if (number === currentFishNumber) {
      fish.classList.remove("game__fish--stroke");
      fish.classList.add("game__fish--correct");
      correctSound.currentTime = 0;
      correctSound.play();

      currentFishNumber++;

      if (currentFishNumber > 10) {
        completeGame(1);
        fisrtCodeNum.textContent = getCodeDigit(0);
        victorySound.play();
        game.classList.remove("visually-hidden");
      }
    } else {
      fish.classList.remove("game__fish--stroke");
      fish.classList.add("game__fish--wrong");
      setTimeout(() => {
        fish.classList.remove("game__fish--wrong");
        if (!fish.classList.contains("game__fish--correct")) {
          fish.classList.add("game__fish--stroke");
        }
      }, 1000);
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
  });
});