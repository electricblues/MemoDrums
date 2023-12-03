// given a key, plays a sound
function playSoundByKey(key) {
  const dataKey = `[data-key="${key.toLowerCase()}"]`;

  const audio = document.querySelector(`audio${dataKey}`);
  const tile = document.querySelector(`div.key${dataKey}`);

  if (audio) {
    audio.currentTime = 0;
    audio.play();
    tile.classList.add("active");
    tile.style.transition = "";
    setTimeout(() => {
      tile.classList.remove("active");
      tile.style.transition = "all 0.5s";
    }, 200);
  }
}

window.addEventListener("keydown", (e) => playSoundByKey(e.key));
window.addEventListener("keyup");

function play() {
  alert("play");
}
