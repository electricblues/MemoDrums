const LIST_OF_KEYS = ["a", "s", "d", "f", "g"];

const playButton = document.querySelector("#play");
const gameText = document.getElementById("game-text");
const scoreCount = document.getElementById("score-count");

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
function computerTurn(keysToPlay, speed) {
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

function waitASecond() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

//Main game function
async function play() {
  let listLength = 3;
  let speed = 500;
  let shouldPlay = true;
  let score = 0;
  scoreCount.innerText = score;

  //Game loop
  while (shouldPlay) {
    let freshList = newRandomKeys(Math.floor(listLength));

    gameText.innerText = "Repeat the key pattern";
    //at first the computer plays the keys
    await computerTurn(freshList, speed);
    //waits for the player to play the keys
    shouldPlay = await playerTurn(freshList);
    // we increase the score and difficulty if the player wins the round
    if (shouldPlay) {
      gameText.innerText = "Well Done!!!";
      score += Math.ceil(500 / speed + listLength + 1);
      scoreCount.innerText = score;
      listLength += 0.5; // increases the listLength every other turn
      speed = speed * 0.9;
    } else {
      gameText.innerText = "Game over :( \n Press play to start over";
    }

    await waitASecond();
  }
}

// attache play functionality to the play button
playButton.addEventListener("click", () => play());
