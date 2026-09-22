const completedGames = JSON.parse(
  localStorage.getItem("completedGames")
) || [];

export function completeGame(gameNumber) {
  completedGames[gameNumber - 1] = true;

  localStorage.setItem(
    "completedGames",
    JSON.stringify(completedGames)
  );
}

export function isGameCompleted(gameNumber) {
  return completedGames[gameNumber - 1] === true;
}

export function getCompletedGamesCount() {
  return completedGames.filter(Boolean).length;
}

export function resetProgress() {
  completedGames.length = 0;
  localStorage.setItem(
    "completedGames",
    JSON.stringify(completedGames)
  );
}