// Preloader

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
      preloader.classList.add("hide");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 1000)
    }, 2000);
  });


// Dialog box

const dialogText = document.getElementById("dialog-text");
const catSprite = document.getElementById("cat-sprite");
const nextBtn = document.getElementById("next-btn");
const dialog = document.getElementById("dialog");
const nameContainer = document.getElementById("name-container");
const nameInput = document.getElementById("name");

const dialogs = [
  {
    text: "Привет! Меня зовут кот Рудис. Давай поиграем!",
    sprite: "images/cat-dialog-1.png"
  },
  {
    text: "Как тебя зовут?",
    sprite: "images/cat-dialog-2.png"
  },
  {
    text: "",
    sprite: "images/cat-dialog-3.png"
  },
  {
    text: "Я загадал для тебя код! Реши задачки, чтобы узнать его!",
    sprite: "images/cat-dialog-4.png"
  }
];

let playerName = "";
let currentDialog = 0;

function showDialog(step) {
    catSprite.src = dialogs[step].sprite;
    switch (step) {
        case 1:
            nameContainer.hidden = false;
            dialogText.textContent = dialogs[step].text;
            break;

        case 2:
            nameContainer.hidden = true;
            dialogText.textContent =
                `Приятно познакомиться, ${playerName}!`;
            break;

        default:
            nameContainer.hidden = true;
            dialogText.textContent = dialogs[step].text;
    }
}

showDialog(currentDialog)

nextBtn.onclick = () => {
    if (currentDialog === 1) {
        playerName = nameInput.value.trim();
        if (!playerName) {
            playerName = "котёнок"
        }
    }

    if (currentDialog >= dialogs.length - 1) {
        dialog.style.display = "none";
        return;
    }

    currentDialog++;
    showDialog(currentDialog);

};

