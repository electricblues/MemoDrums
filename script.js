const LIST_OF_KEYS = ["a", "s", "d", "f", "g"];

//generates a random list of keys of a particular length
function newRandomKeys(length) {
  const newArray = [];
  for (let i = 0; i < length; i++) {
    let randomInteger = Math.floor(Math.random() * LIST_OF_KEYS.length);
    newArray.push(LIST_OF_KEYS[randomInteger]);
  }
  return newArray;
}

// given a key, it plays the sound associated with that key
// changes the keys appearance when pressed/playing
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

//returns a promise that plays a list of keys once, at a particular speed, and then resolves
function computerTurn(keysToPlay, speed = 500) {
  return new Promise((resolve) => {
    let keyIndex = 0;
    const myInterval = setInterval(() => {
      playSoundByKey(keysToPlay[keyIndex]);
      keyIndex++;
      if (keyIndex === keysToPlay.length) {
        clearInterval(myInterval);
        resolve();
      }
    }, speed);
  });
}

// makes sure that the player presses the keys in the correct order.
// resolves true/false
function playerTurn(keysToPlay) {
  return new Promise((resolve) => {
    let keyIndex = 0;

    function keyEventHandler(event) {
      if (event.key === keysToPlay[keyIndex]) {
        playSoundByKey(event.key);
        keyIndex++;
      } else {
        window.removeEventListener("keydown", keyEventHandler);
        resolve(false); // player made a mistake
      }

      if (keyIndex === keysToPlay.length) {
        window.removeEventListener("keydown", keyEventHandler);
        resolve(true); // player played all keys correctly
      }
    }

    window.addEventListener("keydown", keyEventHandler);
  });
}

async function play() {
  // generate a list of keys
  let freshList = newRandomKeys(3);
  let shouldPlay = true;
  // we make the computer play it
  while (shouldPlay) {
    await computerTurn(freshList);
    shouldPlay = await playerTurn(freshList);
    freshList = newRandomKeys(3);
    // we make the player play it
    // repeat forever
  }
}

// attache play functionality to the play button
const playButton = document.querySelector("#play");

playButton.addEventListener("click", () => play(playButton));
