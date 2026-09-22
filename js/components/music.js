export function increaseMusicVolume(music, targetVolume) {
  const interval = setInterval(() => {
    if (music.volume >= targetVolume) {
      clearInterval(interval);
      return;
    }
    music.volume += 0.01;
  }, 30);
}