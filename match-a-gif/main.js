import './style.css'

(function () {
  setGrid(4,4);
  handleGifs();
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

function handleGifs() {
  let promises = [];

  for (let i = 0; i < 8; i++) {
    promises.push(getGif());
  }

  Promise.all(promises).
  then((results) => {
    results.forEach(result => results.push(result));
    let shuffledResults = shuffle(results);
    console.log(shuffledResults);
    loadGifs(shuffledResults);
    matchAGif(shuffledResults);
  }).catch((err) => console.log(err));  

}

function loadGifs(gifsArray) {
  const cells = document.querySelectorAll(".grid-cell");

  for (let i = 0; i < gifsArray.length; i++) {
    const img = document.createElement("img");
    img.src = gifsArray[i].url;
    img.id = gifsArray[i].id;
    cells[i].appendChild(img);
    img.style.display = "none";
  }
}


// Will handle our game logic
function matchAGif() {
  const cells = document.querySelectorAll(".grid-cell");
  let cellOne, cellTwo;

  cells.forEach(cell => {
    cell.addEventListener("click", (e)=>{
      let clickedCell = e.target;

      if (clickedCell !== cellOne) {
        clickedCell.querySelector("img").style.display = "";

        if (!cellOne) {
          return cellOne = clickedCell;
        }
        
        cellTwo = clickedCell;
        // console.log(cellOne, cellTwo);
        let cellOneGif = cellOne.querySelector("img"),
        cellTwoGif = cellTwo.querySelector("img");
        
        compareGifs(cellOneGif, cellTwoGif);
      }
      
    })
  })

  function compareGifs(gifOne, gifTwo) {
    if (gifOne.id === gifTwo.id) {
      console.log("Match!");
      cellOne = cellTwo = '';
    } else {
      console.log("No Match.");
      setTimeout(() => { // if two card not matched
        gifOne.style.display = 'none';
        gifTwo.style.display = 'none';
    }, 800);
      cellOne = cellTwo = '';
    }
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

// When click grid cell, return img id
// Then we want to click another grid cell
// When that grid cell is clicked, compare current grid cell's id with other clicked cell
// if those id's match, stay displayed else both displays are set to none