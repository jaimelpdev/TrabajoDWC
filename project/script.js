let points = 0;
let hintPurchased = false;
let extraAttempts = 0;

// Function to start the guessing game
async function startGuessingGame() {
  const selectedDriver = await selectRandomDriver();

  const messageDiv = document.getElementById("messageDiv");

  let attemptsLeft = 3 + extraAttempts; // Base attempts plus any extra attempts purchased

  usePurchasedItems(selectedDriver, messageDiv); // Use purchased items at the start

  if (hintPurchased) {
    const hint = getRandomHint(selectedDriver);
    messageDiv.innerHTML = `Hint: ${hint}`;
  } else {
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

// Function to update points display and save to localStorage
function updatePoints() {
  const pointsSpan = document.getElementById("points");
  pointsSpan.innerText = points;
  localStorage.setItem("points", points);
  console.log(`Points: ${points}`);
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
        applyPurchaseEffect(button.innerText); // Apply the effect of the purchased item
        alert(`You bought ${button.innerText}`);
      } else {
        alert("Not enough points!");
      }
    });
  });
}

// Function to purchase hint
function purchaseHint() {
  hintPurchased = true;
  console.log("Hint purchased");
}

// Function to purchase extra attempts
function purchaseExtraAttempts(attempts) {
  extraAttempts += attempts;
  console.log(`Extra attempts purchased: ${attempts}`);
}

// Function to apply the effect of the purchased item
function applyPurchaseEffect(itemName) {
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");
  const button3 = document.getElementById("button3");

  if (button1 && button2 && button3) {
    switch (itemName) {
      case button1.innerText:
        purchaseHint();
        break;
      case button2.innerText:
        purchaseExtraAttempts(1);
        break;
      case button3.innerText:
        purchaseExtraAttempts(3);
        break;
      default:
        alert("Unknown item purchased");
    }
    updatePoints();
  }
}

// Function to use purchased items during the game
function usePurchasedItems(selectedDriver, messageDiv) {
  if (hintPurchased) {
    // Provide a hint
    const hint = getRandomHint(selectedDriver);
    messageDiv.innerHTML = `Hint: ${hint}`;
    hintPurchased = false; // Use the hint
  }

  // Use extra attempts if needed
  if (extraAttempts > 0) {
    // Allow extra attempts
    extraAttempts--;
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
};
