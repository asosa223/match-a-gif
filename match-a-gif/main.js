import './style.css'

(function () {
  //handleGifs();
  handleMenu();
})();


function setGrid(rows, cols){
  const content = document.querySelector(".content-container");
  const grid = document.createElement("div");
  grid.classList.add("grid");
  grid.style.setProperty("--grid-rows", rows);
  grid.style.setProperty("--grid-cols", cols);

  for (let i = 0; i < (rows * cols); i++) {
    let cell = document.createElement("div")
    grid.appendChild(cell).className = "grid-cell";
  }

  content.appendChild(grid); 
}


async function getGif() {
  const apiKey = "cuXoEQWW553PdfThfH0fdMWkbEkVlRcq";

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=dogs`, 
    {mode : "cors",});
    const gifData = await response.json();
    const gifUrl = gifData.data.images.fixed_height.url;
    const gifID = gifData.data.id;
    return {
      url: gifUrl,
      id: gifID
    };
  } catch {
      console.log("error");
  }
}

function handleGifs(gridSize) {
  let promises = [];
  let pairs = gridSize * gridSize / 2;

  for (let i = 0; i < pairs; i++) {
    promises.push(getGif());
  }

  Promise.all(promises).
  then((results) => {
    results.forEach(result => results.push(result));
    let shuffledResults = shuffle(results);
    console.log(shuffledResults);
    setGrid(gridSize, gridSize);
    loadGifs(shuffledResults);
    matchAGif(pairs);
  }).catch((err) => console.log(err));  

  function loadGifs(gifsArray) {
    const cells = document.querySelectorAll(".grid-cell");
  
    for (let i = 0; i < gifsArray.length; i++) {
      const img = document.createElement("img");
      img.src = gifsArray[i].url;
      img.id = gifsArray[i].id;
      cells[i].appendChild(img);
      img.classList.add("hide-gif");
    }
  }
}




// Will handle our game logic
function matchAGif(pairs) {
  const cells = document.querySelectorAll(".grid-cell");
  let cellOne, cellTwo;
  let matches = 0;

  cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
  })

  function handleClick(e) {
    let clickedCell = e.target;

    if (clickedCell !== cellOne) {
      clickedCell.querySelector("img").classList.remove("hide-gif");

      if (!cellOne) {
        return cellOne = clickedCell;
      }
      
      cellTwo = clickedCell;
  
      let cellOneGif = cellOne.querySelector("img"),
      cellTwoGif = cellTwo.querySelector("img");
      
      compareGifs(cellOneGif, cellTwoGif);
    }
  }

  function compareGifs(gifOne, gifTwo) {
    if (gifOne.id === gifTwo.id) {
      matches++;
      console.log("Match!");
      if (matches === pairs) {
        handleGameOver();
      }
      cellOne.removeEventListener("click", handleClick);
      cellTwo.removeEventListener("click", handleClick);
      cellOne = cellTwo = '';
    } else {
      console.log("No Match.");
      setTimeout(() => { 
        gifOne.classList.add("hide-gif");
        gifTwo.classList.add("hide-gif");
    }, 800);
      cellOne = cellTwo = '';
    }
  }

  function handleGameOver() {
    const overlay = document.querySelector(".overlay-container");
    overlay.classList.add("show-overlay");
  }
}



function shuffle(array) {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function handleMenu() {
  const menu = document.querySelector(".menu");
  const play = menu.querySelector("#play");
  const easy = menu.querySelector("#easy");
  const hard = menu.querySelector("#hard");
  let gridSize;

  function handleDifficulty(e) {
    let difficulty = e.target;

    if (difficulty === easy) {
      gridSize = 4;
      difficulty.classList.add("clicked");
      if (hard.classList.contains("clicked")) {
        hard.classList.remove("clicked");
      }
    } else if (difficulty === hard) {
      gridSize = 6;
      difficulty.classList.add("clicked");
      if (easy.classList.contains("clicked")) {
        easy.classList.remove("clicked");
      }
    }

    console.log(gridSize);
  }

  function handlePlay() {
    if (gridSize === undefined) {
      console.log("Please select Difficulty");
    } else {
      menu.remove();
      handleGifs(gridSize);
    }
  }

  easy.addEventListener("click", handleDifficulty);
  hard.addEventListener("click", handleDifficulty);
  play.addEventListener("click", handlePlay);
}


// Gif match Game
/**Game will start with a X by X grid of boxes with hidden gif values
 * * Player will choose a box and a gif will be revealed
 * * * When player clicks cell, reveal loaded gif
 * * Player will then choose another box and another gif will be revealed
 * * if both gifs match, then they will stay revealed on the grid
 * * if they do not match, then both gifs will be hidden again
 * * once all gifs have been revealed, game is complete and the player wins
 * 
 * Things to add to game:
 * * adding a timer against the player
 * * * if the timer runs out, the game is lost
 */
