let title = "Ramen store";
let startButton;
let restartButton; 
let ramenImage;
let gameStart, gameOver;  
let alpha = 0; 
let gameStarted = false; 
let gameInProgress = false; 

let timer; 
let isRunning = false; 
let startTime; 
const maxTime = 2 * 60 * 1000 + 20 * 1000; 
const barHeight = 10; 
const barYPosition = 20; 
let maxBarWidth;
let gameEnded = false; 
let score = 0;

let colorShift = 0; 
let gameEndedPlayed = false;

let images = [];
let burntPot;
let newPot;
let backgroundImage;
let locatedPot;

let positions = [
  {x: 50, y: 100},
  {x: 270, y: 140},
  {x: 365, y: 125},
  {x: 455, y: 130},
  {x: 640, y: 80},
  {x: 600, y: 280}
];

let potPositions = [
  {x: 45, y: 380, img: null},
  {x: 150, y: 290, img: null},
  {x: 245, y: 380, img: null},
  {x: 360, y: 290, img: null},
  {x: 460, y: 380, img: null},
];

let timerStart = null;
let timerElapsed = 0;
let clickedImages = []; 

function preload() {
  ramenImage = loadImage("img/Ramen.gif");
  gameStart = loadSound("media/game start_boiling water.wav");
  gameOver = loadSound("media/gameover.wav");  
  backgroundImage = loadImage('img/background.png');

  images[0] = loadImage('img/image1.png');
  images[1] = loadImage('img/image5.png');
  images[2] = loadImage('img/image7.png');
  images[3] = loadImage('img/image9.png');
  images[4] = loadImage('img/image11.png');
  images[5] = loadImage('img/image3.png');
  images[6] = loadImage('img/image4.png');
  images[7] = loadImage('img/image8.png');
  images[8] = loadImage('img/image6.png');
  images[9] = loadImage('img/image10.png');
  images[10] = loadImage('img/image12.png');

  burntPot = loadImage('img/burntPot.png');
  newPot = loadImage('img/image2.png');
}

function setup() {

  createCanvas(800, 600);
  maxBarWidth = width / 2; 

  //Startbutton
  startButton = createButton('Start Game');
  startButton.position(windowWidth / 2 - startButton.width / 2, windowHeight / 2 - startButton.height / 2+250);
  styleButton(startButton);
  startButton.mousePressed(startIntro);
  
  gameStart.loop();
}

// Function to center the button
function positionStartButton() {
  startButton.position(windowWidth / 2 - startButton.width / 2, windowHeight / 2 - startButton.height / 2+160);
}

// This function is triggered every time the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionStartButton(); // Update the button's position
}

function runTimer() {
  let displayTime = millis() - startTime; 
  displayTime = constrain(displayTime, 0, maxTime); 

  // Calculate bar width
  let remainingTime = maxTime - displayTime;
  let barWidth = map(remainingTime, 0, maxTime, 0, maxBarWidth); // Map to maxBarWidth for scaling

  // Draw the progress bar
  fill(150, 200, 100);
  rect(0, barYPosition - barHeight / 2, barWidth, barHeight);

  // When time is up
  if (displayTime >= maxTime) {
    gameEnded = true; 
  }
}

function draw() {
  if (!gameStarted) {
    drawBackground(); 
    drawTitle();
  } else if (!gameInProgress) {
    drawGameIntro();
  } else {
    runGame();
  }
  
  if (gameEnded) {
    displayGameOver();
  }
}

function drawBackground() {
  background(128, 0, 128);
    image(ramenImage, width / 2 - 100, height / 2 - 170);
  
  if (gameEnded) {
    gameOver();
  }
}

function drawTitle() {
  textSize(60); // Title size is smaller now
  textAlign(CENTER, CENTER);
  
  // Shadow effect
  fill(0, 0, 0, 150);
  text(title, width / 2 + 5, height / 2 - 150 + 5);
  
  // Main title
  fill(255, 230, 0, alpha);
  text(title, width / 2, height / 2 - 150);
  
  // Increase opacity
  alpha += 5; 
  if (alpha > 255) alpha = 255; 
}

function styleButton(button) {
  button.style('font-size', '24px');
  button.style('padding', '15px');
  button.style('background-color', '#FFD700');
  button.style('border', '2px solid #FF8C00');
  button.style('border-radius', '10px');
  button.style('color', 'white');
  button.style('box-shadow', '2px 2px 5px rgba(0, 0, 0, 0.5)');
  button.style('transition', 'background-color 0.3s ease, transform 0.2s ease');

  button.mouseOver(() => {
    button.style('background-color', '#FFA500');
    button.style('transform', 'scale(1.05)');
  });
  button.mouseOut(() => {
    button.style('background-color', '#FFD700');
    button.style('transform', 'scale(1)');
  });
}

function startIntro() {
  gameStarted = true;
  startButton.hide();
  gameStart.stop();
  startTime = millis(); 
}

function drawGameIntro() {
  background(0);
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Making Ramen!", width / 2, height / 2 - 200);
  
  textSize(30);
  text("STEP 1. Clicking for Pot and Water", width / 2, height / 2 - 100);
  text("STEP 2. Clicking for Seasoning", width / 2, height / 2 - 50);
  text("STEP 3. Clicking for Fresh Noodles", width / 2, height / 2 );
  text("STEP 4. Clicking for Toppings", width / 2, height / 2 + 50);
  text("STEP 5. Clicking for Cooked Ramen", width / 2, height / 2 + 100);
  
  text("Press Space Bar to start the game!", width / 2, height / 2 + 190);
}

function keyPressed() {
  if (gameStarted && !gameInProgress && key === ' ') {
    gameInProgress = true; 
    console.log("Game is starting...");
  }
}

function runGame() {
  
  if (gameEnded) {
    return;
  }
  
  image(backgroundImage, 0, 0);
  
  const clickableIndexes = [0, 5, 1, 2, 3, 4]; 
  for (let i of clickableIndexes) {
    if (images[i] && positions[i]) {
      if (i === 4) {
        image(images[i], positions[i].x, positions[i].y, 130, 120);
      score++;
      } else {
        image(images[i], positions[i].x, positions[i].y);
      }
    }
  }

  for (let newPot of potPositions) {
    if (newPot.img) {
      image(newPot.img, newPot.x, newPot.y);
    }
  }

  if (timerStart !== null) {
    timerElapsed = millis() - timerStart;
    textSize(24);
    fill(0);
    textAlign(RIGHT, TOP);
    text(`Score: ${(timerElapsed / 1000).toFixed(2)}`, width - 10, 10);
    
    if (timerElapsed > 7000) {
      potPositions.push({ x: 38, y: 375, img: burntPot });
    }

    if (clickedImages.length === clickableIndexes.length) {
      timerStart = null;
      gameEnded = true;
    }
  }
}

function displayGameOver() {
  background(128, 0, 128); 
  
  colorShift = (sin(millis() / 2000) + 1) * 300; 
  fill(255, colorShift, 0); 
  
  textSize(90);
  textAlign(CENTER, CENTER);
  text('Game Over!', width / 2, height / 2 - 100); 
  
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text('Final Score: ' + score, width / 2, height / 2 + 20);
  
  if (!restartButton) {  // Only create the restart button once
    restartButton = createButton('Restart Game');
    restartButton.position(windowWidth / 2 - startButton.width / 2, windowHeight / 2 - startButton.height / 2+180);
    styleButton(restartButton);
    restartButton.mousePressed(restartGame);
  }
  
  restartButton.show();
  
  if (!gameEndedPlayed && gameOver.isLoaded()) {
    gameOver.play(); 
    gameEndedPlayed = true; 
  }
}

function restartGame() {
  // Reset all game state variables
  gameStarted = false;
  gameInProgress = false;
  gameEnded = false;
  score = 0;             
  timerStart = null; 
  timerElapsed = 0;
  clickedImages = [];
  potPositions = [];
  gameEndedPlayed = false;
  
  // Hide restart button, show start button
  startButton.show();
  restartButton.hide();

  alpha = 0;     
  drawBackground();      

  startIntro(); 
}


// function gameOver() {
//   gameInProgress = false;
//   gameEnded = true;
// }

function mousePressed() {
  const fixedX = 38;
  const fixedY = 375;

  // Only start counting clicks after the game has started
  if (!gameInProgress) return;

  if (timerStart === null) {
    timerStart = millis();
  }

  const clickableIndexes = [0, 5, 1, 2, 3, 4]; 

  for (let i of clickableIndexes) {
    if (images[i] && positions[i]) {
      let imageX = positions[i].x;
      let imageY = positions[i].y;
      let imageWidth = images[i].width;
      let imageHeight = images[i].height;

      // Check if the mouse click is inside the image bounds
      if (
        mouseX > imageX && mouseX < imageX + imageWidth &&
        mouseY > imageY && mouseY < imageY + imageHeight
      ) {
        
        if (i === 4) {
          score++; // 점수 추가
          console.log("Score:", score);
        }
        
        // Ensure the clicked image is in the correct order
        if (clickedImages.length === 0 && i === clickableIndexes[0]) {
          clickedImages.push(i);
          potPositions.push({ x: fixedX, y: fixedY, img: newPot });
        } else if (clickedImages.length === 1 && i === clickableIndexes[1]) {
          clickedImages.push(i);
          potPositions.push({ x: fixedX, y: fixedY, img: images[6] });
        } else if (clickedImages.length === 2 && i === clickableIndexes[2]) {
          clickedImages.push(i);
          potPositions.push({ x: fixedX, y: fixedY, img: images[8] });
        } else if (clickedImages.length === 3 && i === clickableIndexes[3]) {
          clickedImages.push(i);
          potPositions.push({ x: fixedX, y: fixedY, img: images[7] });
        } else if (clickedImages.length === 4 && i === clickableIndexes[4]) {
          clickedImages.push(i);
          potPositions.push({ x: fixedX, y: fixedY, img: images[9] });
        } else if (clickedImages.length === 5 && i === clickableIndexes[5]) {
          clickedImages.push(i);
          potPositions.push({ x: fixedX, y: fixedY, img: images[10] });
          
          // Stop the timer once the last image is clicked
          timerStart = null;
          gameEnded = true;
        }
      }
    }
  }
}
