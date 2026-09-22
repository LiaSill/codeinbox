export function playDialogSound(step, dialogList) {
  return new Promise((resolve) => {
    const sound = new Audio(dialogList[step].sound);
    sound.volume = 1;
    sound.addEventListener("ended", resolve);
    sound.play().catch(() => {
      resolve();
    });
  });
}