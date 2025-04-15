import "/src/style.css"

(function () {
  handleMenu();
})();

// Sets up our grid to hold gifs
function setGrid(rows, cols){
  const content = document.querySelector(".content-container");
  const grid = document.createElement("div");

  grid.classList.add("grid");
  grid.style.setProperty("--grid-rows", rows);
  grid.style.setProperty("--grid-cols", cols);

  for (let i = 0; i < (rows * cols); i++) {
    let cell = document.createElement("div");
    grid.appendChild(cell).className = "grid-cell";
  }

  content.appendChild(grid); 
}

// Fetch our gif from Giphy API 
async function getGif(tag) {
  const apiKey = "cuXoEQWW553PdfThfH0fdMWkbEkVlRcq";

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}`, 
    {mode : "cors",});
    const gifData = await response.json();
    const gifUrl = gifData.data.images.fixed_height.url;
    const gifID = gifData.data.id;
    return {
      url: gifUrl,
      id: gifID
    };
  } catch {
      console.log("error loading gifs");
  }
}

// Handles getting and loading gifs
function handleGifs(gridSize, gifTag) {
  let promises = [];
  let pairs = gridSize * gridSize / 2;

  for (let i = 0; i < pairs; i++) {
    promises.push(getGif(gifTag));
  }

  Promise.all(promises).
  then((results) => {
    results.forEach(result => results.push(result));
    let shuffledResults = shuffle(results);
    setGrid(gridSize, gridSize);
    loadGifs(shuffledResults);
    matchAGif(pairs);
  }).catch((err) => console.log(err));  

  // Loads gifs onto our grid
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

  // Handles user clicking grid cells
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

  // Compares clicked gifs to see if they match
  function compareGifs(gifOne, gifTwo) {
    if (gifOne.id === gifTwo.id) {
      matches++;
      if (matches === pairs) {
        handleGameOver();
      }
      cellOne.removeEventListener("click", handleClick);
      cellTwo.removeEventListener("click", handleClick);
      cellOne.style.cursor = "not-allowed";
      cellTwo.style.cursor = "not-allowed";
      cellOne = cellTwo = '';
    } else {
      setTimeout(() => { 
        gifOne.classList.add("hide-gif");
        gifTwo.classList.add("hide-gif");
    }, 800);
      cellOne = cellTwo = '';
    }
  }

  // Handles the game over screen and reset
  function handleGameOver() {
    const overlay = document.querySelector(".overlay-container");
    const restart = overlay.querySelector("#restart");
    overlay.classList.add("show-overlay");

    restart.addEventListener("click", () => {
      window.location.reload();
    })
  }
}


// Shuffles a passed in array
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

// Handle our game menu
function handleMenu() {
  const menu = document.querySelector(".menu");
  let categoryForm = menu.querySelector(".menu-input");
  const category = document.createElement("div");
  category.classList.add("display-category");
  const play = menu.querySelector("#play");
  const easy = menu.querySelector("#easy");
  const hard = menu.querySelector("#hard");
  let gridSize, gifCategory;

  // User can input category of gifs
  categoryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let categoryInput = menu.querySelector("#gif-category");

    gifCategory = categoryInput.value;
    categoryInput.value = "";
    category.innerHTML = `<span>Category: </span>${gifCategory}`
    menu.appendChild(category);
  })
  
  // User will select easy or hard
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
  }

  // Handles play functionality
  function handlePlay() {
    const error = document.createElement("div");
    error.classList.add("menu-error");

    if (gridSize == undefined) {
      error.textContent = "Please Select Difficulty";
      menu.appendChild(error);
      setTimeout(() => {
        error.remove();
      }, 3000);
    } else if (gifCategory == undefined) {
        error.textContent = "Please Input Category";
        menu.appendChild(error);
        setTimeout(() => {
          error.remove();
        }, 3000);
    } else {
        menu.remove();
        handleGifs(gridSize, gifCategory);
    }
  }

  easy.addEventListener("click", handleDifficulty);
  hard.addEventListener("click", handleDifficulty);
  play.addEventListener("click", handlePlay);
}
