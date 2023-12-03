const key = document.querySelector('audio[data-key="a"]');
console.log(key);

function play() {
  alert("play");
}

const playButton = document.querySelector("#play");
playButton.addEventListener("click", () => play(playButton));
