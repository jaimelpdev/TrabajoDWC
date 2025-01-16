let points = 0;
let hintPurchased = false;
let extraAttempts = 0;

// Function to start the guessing game
async function startGuessingGame() {
  const selectedDriver = await selectRandomDriver();

  const messageDiv = document.getElementById("messageDiv");

  let attemptsLeft = 3 + extraAttempts; // Base attempts plus any extra attempts purchased

  usePurchasedItems(selectedDriver); // Use purchased items at the start

  if (!hintPurchased) {
    messageDiv.innerHTML =
      "Guess the F1 driver! You have " + attemptsLeft + " attempts.";
  }

  let tries = 1;

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

// Function to handle point store purchases
function setupPointStore() {
  const storeButtons = document.querySelectorAll("#point-store button");
  storeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cost = parseInt(button.getAttribute("data-cost"));
      if (points >= cost) {
        points -= cost;
        updatePoints();
        applyPurchaseEffect(button.id); // Use button id instead of innerText
        alert(`You bought ${button.innerText}`);
      } else {
        alert("Not enough points!");
      }
    });
  });
}

// Function to apply the effect of the purchased item
function applyPurchaseEffect(buttonId) {
  const button = document.getElementById(buttonId);
  button.disabled = true; // Disable the button after purchase

  switch (buttonId) {
    case "button1":
      purchaseExtraAttempts(1, button);
      break;
    case "button2":
      purchaseExtraAttempts(3, button);
      break;
    default:
      alert("Unknown item purchased");
  }
  updatePoints();
}

// Function to purchase extra attempts
function purchaseExtraAttempts(attempts, button) {
  extraAttempts += attempts;
  localStorage.setItem("extraAttempts", extraAttempts.toString());
  console.log(`Extra attempts purchased: ${attempts}`);
}

// Function to update points display
function updatePoints() {
  document.getElementById("points").innerText = points;
  localStorage.setItem("points", points.toString());
}

// Function to load points from localStorage
function loadPoints() {
  const savedPoints = localStorage.getItem("points");
  if (savedPoints !== null) {
    points = parseInt(savedPoints);
  }
  const savedHintPurchased = localStorage.getItem("hintPurchased");
  if (savedHintPurchased !== null) {
    hintPurchased = savedHintPurchased === "true";
  }
  const savedExtraAttempts = localStorage.getItem("extraAttempts");
  if (savedExtraAttempts !== null) {
    extraAttempts = parseInt(savedExtraAttempts);
  }
  updatePoints();
}

// Function to use purchased items during the game
function usePurchasedItems(selectedDriver) {
  const messageDiv = document.getElementById("messageDiv");
  if (!messageDiv) {
    console.error("messageDiv not found");
    return;
  }

  // Use extra attempts if needed
  if (extraAttempts > 0) {
    // Allow extra attempts
    extraAttempts--;
    localStorage.setItem("extraAttempts", extraAttempts.toString());
    if (extraAttempts === 0) {
      document.getElementById("button1").disabled = false; // Re-enable the button
      document.getElementById("button2").disabled = false; // Re-enable the button
    }
  }
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

// Start the game and setup the point store when the page loads
window.onload = function () {
  loadPoints();
  startGuessingGame();
  setupPointStore();
  disablePurchasedButtons();
};
