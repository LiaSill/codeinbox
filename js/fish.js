// Preloader + Music

const bgFishMusic = new Audio("assets/sounds/fish-theme.mp3");
bgFishMusic.loop = true;
bgFishMusic.volume = 0.1;

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
      preloader.classList.add("hide");
      setTimeout(() => {
        preloader.style.display = "none";

        bgFishMusic.play().catch(() => {
          console.log("Браузер заблокировал автоматическое воспроизведение.")
        })
      }, 1000)
    }, 2000);
  });

// Functions

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

// Fish Dialog Box
const fishDialogText = document.getElementById("fishDialog-text");
const fishCatSprite = document.getElementById("fishCat-sprite");
const fishNextBtn = document.getElementById("fishNext-btn");
const fishDialog = document.getElementById("fishDialog");

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
      // fishNextBtn.disabled = true;
      bgFishMusic.volume = 0.1;
      bgFishMusic.play().catch(() => {});
      await playDialogSound(currentFishDialog);
      // fishNextBtn.disabled = false;
      return;
    }

    if (currentFishDialog === 1 || currentFishDialog === 2) {
      fishCatSprite.classList.add("visually-hidden")
    }

    if (currentFishDialog >= fishDialogs.length - 1) {
        fishDialog.style.display = "none";
        increaseMusicVolume(bgFishMusic);
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

fishes.forEach(fish => {
  fish.addEventListener("click", () => {
    const number = Number(fish.dataset.number);
    if (number === currentFishNumber) {
      fish.classList.add("game__fish--correct");
      correctSound.currentTime = 0;
      correctSound.play();

      currentFishNumber++;

      if (currentFishNumber > 10) {
        victorySound.play();
        game.classList.remove("visually-hidden")
      }
    } else {
      fish.classList.add("game__fish--wrong");
      setTimeout(() => {
        fish.classList.remove("game__fish--wrong");
      }, 1000);
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
  });
});