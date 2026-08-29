// Preloader + Music

const bgMainMusic = new Audio("assets/sounds/main-theme.mp3");
bgMainMusic.loop = true;
bgMainMusic.volume = 0.1;

window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
      preloader.classList.add("hide");
      setTimeout(() => {
        preloader.style.display = "none";

        bgMainMusic.play().catch(() => {
          console.log("Браузер заблокировал автоматическое воспроизведение.")
        })
      }, 1000)
    }, 2000);
  });

// Increase Music Volume

function increaseMusicVolume(music) {
  const targetVolume = 0.6;
  const interval = setInterval(() => {
    if (music.volume >= targetVolume) {
      clearInterval(interval);
      return;
    }
    music.volume += 0.01;
  }, 30);
}

// Index Dialog box

const indexDialogText = document.getElementById("indexDialog-text");
const indexCatSprite = document.getElementById("indexCat-sprite");
const indexNextBtn = document.getElementById("indexNext-btn");
const indexDialog = document.getElementById("indexDialog");
const nameContainer = document.getElementById("name-container");
const nameInput = document.getElementById("name");

const indexDialogs = [
  {
    text: "Привет! Меня зовут кот Рудис.\nДавай поиграем!",
    sprite: "images/cat-dialog-1.png",
    sound: "assets/sounds/dialog-1-audio(1).m4a"
  },
  {
    text: "Как тебя зовут?",
    sprite: "images/cat-dialog-2.png",
    sound: "assets/sounds/dialog-2-audio(1).m4a"
  },
  {
    text: "",
    sprite: "images/cat-dialog-3.png",
    sound: "assets/sounds/dialog-3-audio(2).m4a"
  },
  {
    text: "Будем мы с тобой играть,\nЦифры кода узнавать!",
    sprite: "images/cat-dialog-4.png",
    sound: "assets/sounds/dialog-4-audio(2).m4a"
  }
];

let playerName = "";
let currentIndexDialog = 0;
let firstIndexDialogPlayed = false;

function playDialogSound(step, dialogList) {
  return new Promise((resolve) => {
    const sound = new Audio(dialogList[step].sound);
    sound.volume = 1;
    sound.addEventListener("ended", resolve);
    sound.play().catch(() => {
      resolve();
    });
  });
}

function showIndexDialog(step) {
    indexCatSprite.src = indexDialogs[step].sprite;
    switch (step) {
        case 1:
            nameContainer.hidden = false;
            indexDialogText.textContent = indexDialogs[step].text;
            break;

        case 2:
            nameContainer.hidden = true;
            indexDialogText.textContent =
                `Приятно познакомиться,\n${playerName}!`;
            break;

        default:
            nameContainer.hidden = true;
            indexDialogText.textContent = indexDialogs[step].text;
    }
}

showIndexDialog(currentIndexDialog)

indexNextBtn.onclick = async () => {

    if (currentIndexDialog === 0 && !firstIndexDialogPlayed) {
      firstIndexDialogPlayed = true;
      indexNextBtn.disabled = true;
      bgMainMusic.volume = 0.1;
      bgMainMusic.play().catch(() => {});
      await playDialogSound(currentIndexDialog, indexDialogs);
      indexNextBtn.disabled = false;
      return;
    }

    if (currentIndexDialog === 1) {
        playerName = nameInput.value.trim();
        if (!playerName) {
            playerName = "котёнок"
        }
    }

    if (currentIndexDialog >= indexDialogs.length - 1) {
        indexDialog.style.display = "none";
        increaseMusicVolume(bgMainMusic);
        return;
    }

    currentIndexDialog++;
    showIndexDialog(currentIndexDialog);
    indexNextBtn.disabled = true;
    await playDialogSound(currentIndexDialog, indexDialogs);
    indexNextBtn.disabled = false;
};