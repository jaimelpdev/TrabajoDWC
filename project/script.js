// Function to load drivers from JSON file
async function loadDrivers() {
  const response = await fetch('./drivers.json');
  const data = await response.json();
  return data.f1Drivers;
}

// Function to select a random driver
async function selectRandomDriver() {
  const f1Drivers = await loadDrivers();
  const index = Math.floor(Math.random() * f1Drivers.length);
  return f1Drivers[index]; // Return the entire driver object
}

// Function to get a random hint excluding the selected driver
async function getRandomHint(selectedDriver) {
  const f1Drivers = await loadDrivers();
  const otherDrivers = f1Drivers.filter(
    (driver) => driver.name === selectedDriver.name
  );
  const hintIndex = Math.floor(Math.random() * otherDrivers.length);
  const hintDriver = otherDrivers[hintIndex];

  // Provide a hint based on the selected driver's different things.
  const hintTypes = ["team", "debutYear", "age", "championships", "wins"];
  const hintType = hintTypes[Math.floor(Math.random() * hintTypes.length)];

  switch (hintType) {
    case "team":
      return `This driver races for the team: ${hintDriver.team}`;
    case "debutYear":
      return `This driver debuted in the year: ${hintDriver.debutYear}`;
    case "age":
      return `This driver is ${hintDriver.age} years old`;
    case "championships":
      return `This driver has won ${hintDriver.championships} championships`;
    case "wins":
      return `This driver has ${hintDriver.wins} wins`;
    default:
      return "No hint available";
  }
}

// Function to start the guessing game
async function startGuessingGame() {
  const selectedDriver = await selectRandomDriver();
  let attempsLeft = 3; // Number of attempts will be 5
  let tries = 1;
  let guessedCorrectly = false;

  const messageDiv = document.getElementById("messageDiv");
  messageDiv.innerHTML =
    "Guess the F1 driver! You have " + attempsLeft + " attemps.";

  const submitButton = document.getElementById("submit-guess");

  submitButton.addEventListener("click", async function () {
    const userGuess = document.getElementById("guess-input").value; // Get user input from the input field

    if (
      userGuess &&
      userGuess.toLowerCase() === selectedDriver.name.toLowerCase()
    ) {
      messageDiv.innerHTML =
        "Congratulations! You guessed correctly: " + selectedDriver.name + " in " + tries + " tries.";
      guessedCorrectly = true;
      submitButton.disabled = true; // Disable the button on correct guess
    } else if (attempsLeft === 1) {
      messageDiv.innerHTML =
        "You have run out of attempts. The correct F1 driver was: " +
        selectedDriver.name;
      submitButton.disabled = true; // Disable the button on incorrect guess
    } else {
      attempsLeft--;
      tries++;
      const hint = await getRandomHint(selectedDriver);
      messageDiv.innerHTML = `Incorrect! ${hint}. You have ${attempsLeft} attempts left.`;
    }
  });
}

// Start the game when the page loads
window.onload = startGuessingGame;