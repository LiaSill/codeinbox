// Preloader + Music
const bgMainMusic = new Audio("assets/sounds/main-theme.mp3");
bgMainMusic.loop = true;
bgMainMusic.volume = 0.1;

import "./components/preloader.js";

// Functions

import { increaseMusicVolume } from "./components/music.js";

import { playDialogSound } from "./components/dialog.js";

import { resetProgress, getCompletedGamesCount } from "./progress.js";

import { getCodeDigit } from "./data/code.js";

// Dialog box

const indexDialogText = document.getElementById("indexDialog-text");
const indexCatSprite = document.getElementById("indexCat-sprite");
const indexNextBtn = document.getElementById("indexNext-btn");
const indexDialog = document.getElementById("indexDialog");
const nameContainer = document.getElementById("name-container");
const nameInput = document.getElementById("name");
const indexTip = document.getElementById("dialogTip");
const gameLink = document.getElementById("game-link");

const codeDigits = [
  document.getElementById("firstCodeNum"),
  document.getElementById("secondCodeNum"),
  document.getElementById("thirdCodeNum"),
  document.getElementById("fourthCodeNum")
];

const codeBoxes = [
  document.getElementById("codebox-1"),
  document.getElementById("codebox-2"),
  document.getElementById("codebox-3"),
  document.getElementById("codebox-4")
];

const codeLocks = [
  null,
  document.querySelector("#codebox-2 .codebox__icon-lock"),
  document.querySelector("#codebox-3 .codebox__icon-lock"),
  document.querySelector("#codebox-4 .codebox__icon-lock")
];

const codeQuestionMarks = [
  document.querySelector("#codebox-1 .codebox__icon-question-mark"),
  document.querySelector("#codebox-2 .codebox__icon-question-mark"),
  document.querySelector("#codebox-3 .codebox__icon-question-mark"),
  document.querySelector("#codebox-4 .codebox__icon-question-mark")
];

const indexDialogs = [
  {
    text: "Привет! Меня зовут кот Рудис.\nДавай поиграем!",
    sprite: "images/cat-dialog-1.png",
    sound: ""
  },
  {
    text: "Как тебя зовут?",
    sprite: "images/cat-dialog-2.png",
    sound: ""
  },
  {
    text: "Приятно познакомиться, {name}!",
    sprite: "images/cat-dialog-3.png",
    sound: ""
  },
  {
    text: "Будем мы с тобой играть,\nЦифры кода узнавать!",
    sprite: "images/cat-dialog-4.png",
    sound: ""
  }
];

const secondDialogs = [
  {
    text: "Ты большой молодец, {name}!",
    sprite: "images/cat-dialog-3.png",
    sound: ""
  },
  {
    text: "Впереди ещё много интересных игр. Продолжай в том же духе!",
    sprite: "images/cat-dialog-1.png",
    sound: ""
  }
];

const thirdDialogs = [
  {
    text: "Половина игр позади! Здорово!",
    sprite: "images/cat-dialog-1.png",
    sound: ""
  },
  {
    text: "У тебя так хорошо получается!\nХочешь стать ученым в будущем?",
    sprite: "images/cat-dialog-2.png",
    sound: ""
  }
];

const fourthDialogs = [
  {
    text: "Финал скоро!\nТы умничка, {name}!",
    sprite: "images/cat-dialog-1.png",
    sound: ""
  },
  {
    text: "Давай отдохнём и раскрасим картинки по фигурам.",
    sprite: "images/cat-dialog-2.png",
    sound: ""
  },
  {
    text: "Ты ведь хорошо знаешь фигуры?",
    sprite: "images/cat-dialog-2.png",
    sound: ""
  }
];

const finalDialogs = [
  {
    text: "Спасибо за игру, {name}!\nБыло очень весело!",
    sprite: "images/cat-dialog-1.png",
    sound: ""
  },
  {
    text: "До новых встреч, дружок!",
    sprite: "images/cat-dialog-2.png",
    sound: ""
  },
  {
    text: "Нажми на картинку, если хочешь поиграть с Рудисом снова!",
    sprite: "",
    sound: ""
  }
];

const mainStates = [
  {
    gameLink: "fish-count-game.html",
    gameClass: "main-page__game-link--fish",
    dialogs: indexDialogs,
    neededNameInput: true
  },
  {
    gameLink: "house-game.html",
    gameClass: "main-page__game-link--house",
    dialogs: secondDialogs,
    neededNameInput: false
  },
  {
    gameLink: "numbers-game.html",
    gameClass: "main-page__game-link--numbers",
    dialogs: thirdDialogs,
    neededNameInput: false
  },
  {
    gameLink: "coloring-game.html",
    gameClass: "main-page__game-link--coloring",
    dialogs: fourthDialogs,
    neededNameInput: false
  },
  {
    gameLink: "index.html",
    gameClass: "main-page__game-link--final",
    dialogs: finalDialogs,
    neededNameInput: false
  }
];

const completedGamesCount = getCompletedGamesCount();
const currentState = mainStates[completedGamesCount];
let playerName = localStorage.getItem("playerName") || "";
let currentIndexDialog = 0;
let firstIndexDialogPlayed = false;

function updateGameLink() {
  gameLink.href = currentState.gameLink;
  gameLink.className = "main-page__game-link";
  gameLink.classList.add(currentState.gameClass);
}

function updateCodeBox(completedGamesNum) {
  for (let i = 0; i < completedGamesNum && i < codeBoxes.length; i++) {
    codeBoxes[i].classList.add("codebox__box--bright");

    if (codeLocks[i]) {
      codeLocks[i].classList.add("visually-hidden");
    }

    codeQuestionMarks[i].classList.add("visually-hidden");

    codeDigits[i].classList.remove("visually-hidden");
    codeDigits[i].textContent = getCodeDigit(i);
  }

  if (completedGamesNum < codeBoxes.length) {
    codeBoxes[completedGamesNum].classList.add("codebox__box--bright");

    if (codeLocks[completedGamesNum]) {
      codeLocks[completedGamesNum].classList.add("visually-hidden");
    }

    codeQuestionMarks[completedGamesNum].classList.remove("visually-hidden");
  }
}

function showDialog(step, dialogs) {
  if (dialogs[step].sprite) {
    indexCatSprite.src = dialogs[step].sprite;
    indexCatSprite.hidden = false;
  } else {
    indexCatSprite.hidden = true;
  }

  if (currentState.neededNameInput && step === 1) {
    nameContainer.hidden = false;
  } else {
    nameContainer.hidden = true;
  }

  indexDialogText.textContent = dialogs[step].text.replace("{name}", playerName);
}

updateGameLink();
updateCodeBox(completedGamesCount);

showDialog(currentIndexDialog, currentState.dialogs);

indexNextBtn.onclick = async () => {

  if (currentIndexDialog === 0 && !firstIndexDialogPlayed) {
    firstIndexDialogPlayed = true;
    indexTip.classList.add("visually-hidden");
    bgMainMusic.volume = 0.1;
    bgMainMusic.play().catch(() => { });
    if (currentState.dialogs.sound != "") {
      indexNextBtn.disabled = true;
      await playDialogSound(currentIndexDialog, currentState.dialogs);
      indexNextBtn.disabled = false;
    }
    return;
  }

  if (currentState.neededNameInput && currentIndexDialog === 1) {
    playerName = nameInput.value.trim();
    if (!playerName) {
      playerName = "котёнок";
      localStorage.setItem("playerName", playerName)
    }
    localStorage.setItem("playerName", playerName);
  }

  if (currentIndexDialog >= currentState.dialogs.length - 1) {
    indexDialog.style.display = "none";
    increaseMusicVolume(bgMainMusic, 0.6);
    return;
  }

  currentIndexDialog++;
  showDialog(currentIndexDialog, currentState.dialogs);
  if (currentState.dialogs.sound != "") {
    indexNextBtn.disabled = true;
    await playDialogSound(currentIndexDialog, currentState.dialogs);
    indexNextBtn.disabled = false;
  }

  if (completedGamesCount == 4) {
    resetProgress();
    localStorage.removeItem("playerName");
  }
};