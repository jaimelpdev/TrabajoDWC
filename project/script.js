let points = 0;

// Function to load drivers from JSON file
async function loadDrivers() {
  const response = await fetch("./drivers.json");
  const data = await response.json();
  return data.f1Drivers;
}

// Function to select a random driver
async function selectRandomDriver() {
  const f1Drivers = await loadDrivers();
  const index = Math.floor(Math.random() * f1Drivers.length);
  return f1Drivers[index]; // Return the entire driver object
}

// Function to get a random hint about the selected driver
function getRandomHint(selectedDriver) {
  const hintTypes = ["team", "debutYear", "age", "championships", "wins"];
  const hintType = hintTypes[Math.floor(Math.random() * hintTypes.length)];

  switch (hintType) {
    case "team":
      return `This driver races for the team: ${selectedDriver.team}`;
    case "debutYear":
      return `This driver debuted in the year: ${selectedDriver.debutYear}`;
    case "age":
      return `This driver is ${selectedDriver.age} years old`;
    case "championships":
      return `This driver has won ${selectedDriver.championships} championships`;
    case "wins":
      return `This driver has ${selectedDriver.wins} wins`;
    default:
      return "No hint available";
  }
}

// Function to start the guessing game
async function startGuessingGame() {
  const selectedDriver = await selectRandomDriver();
  let attemptsLeft = 3; // Number of attempts will be 3
  let tries = 1;
  let guessedCorrectly = false;

  const messageDiv = document.getElementById("messageDiv");
  messageDiv.innerHTML =
    "Guess the F1 driver! You have " + attemptsLeft + " attempts.";

  const submitButton = document.getElementById("submit-guess");

  submitButton.addEventListener("click", function () {
    const userGuess = document.getElementById("guess-input").value; // Get user input from the input field

    if (
      userGuess &&
      userGuess.toLowerCase() === selectedDriver.name.toLowerCase()
    ) {
      messageDiv.innerHTML =
        "Congratulations! You guessed correctly: " +
        selectedDriver.name +
        " in " +
        tries +
        " tries.";
      guessedCorrectly = true;
      submitButton.disabled = true; // Disable the button on correct guess
      points += 10; // Award points for correct guess
      updatePoints();
    } else if (attemptsLeft === 1) {
      messageDiv.innerHTML =
        "You have run out of attempts. The correct F1 driver was: " +
        selectedDriver.name;
      submitButton.disabled = true; // Disable the button on incorrect guess
    } else {
      attemptsLeft--;
      tries++;
      const hint = getRandomHint(selectedDriver);
      messageDiv.innerHTML = `Incorrect! ${hint}. You have ${attemptsLeft} attempts left.`;
    }
  });
}

// Function to update points display and save to localStorage
function updatePoints() {
  const pointsSpan = document.getElementById("points");
  pointsSpan.innerText = points;
  localStorage.setItem("points", points);
}

// Function to load points from localStorage
function loadPoints() {
  const savedPoints = localStorage.getItem("points");
  if (savedPoints !== null) {
    points = parseInt(savedPoints);
  }
  updatePoints();
}

// Function to handle point store purchases
function setupPointStore() {
  const storeButtons = document.querySelectorAll("#point-store button");
  storeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cost = parseInt(button.getAttribute("data-cost"));
      if (points >= cost) {
        points -= cost;
        updatePoints();
        alert(`You bought ${button.innerText}`);
      } else {
        alert("Not enough points!");
      }
    });
  });
}

// Start the game and setup the point store when the page loads
window.onload = function () {
  loadPoints();
  startGuessingGame();
  setupPointStore();
};
