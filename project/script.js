// Array of F1 drivers with details
const f1Drivers = [
  { name: "Max Verstappen", age: 26, debutYear: 2015, team: "Red Bull Racing" },
  { name: "Lando Norris", age: 24, debutYear: 2019, team: "McLaren" },
  { name: "Charles Leclerc", age: 27, debutYear: 2018, team: "Ferrari" },
  { name: "Oscar Piastri", age: 23, debutYear: 2023, team: "McLaren" },
  { name: "Carlos Sainz", age: 29, debutYear: 2015, team: "Ferrari" },
  { name: "George Russell", age: 26, debutYear: 2019, team: "Mercedes" },
  { name: "Lewis Hamilton", age: 39, debutYear: 2007, team: "Mercedes" },
  { name: "Sergio Pérez", age: 34, debutYear: 2011, team: "Red Bull Racing" },
  { name: "Fernando Alonso", age: 43, debutYear: 2001, team: "Aston Martin" },
  { name: "Pierre Gasly", age: 28, debutYear: 2017, team: "Alpine" },
  { name: "Nico Hülkenberg", age: 36, debutYear: 2010, team: "Haas" },
  { name: "Yuki Tsunoda", age: 24, debutYear: 2021, team: "RB Team" },
  { name: "Lance Stroll", age: 25, debutYear: 2017, team: "Aston Martin" },
  { name: "Esteban Ocon", age: 27, debutYear: 2016, team: "Alpine" },
  { name: "Kevin Magnussen", age: 31, debutYear: 2014, team: "Haas" },
  { name: "Alexander Albon", age: 28, debutYear: 2019, team: "Williams" },
  { name: "Daniel Ricciardo", age: 35, debutYear: 2011, team: "RB Team" },
  { name: "Oliver Bearman", age: 20, debutYear: 2023, team: "Haas" },
  { name: "Franco Colapinto", age: 21, debutYear: 2024, team: "Williams" },
  { name: "Zhou Guanyu", age: 25, debutYear: 2022, team: "Kick Sauber" },
  { name: "Liam Lawson", age: 21, debutYear: 2023, team: "RB Team" },
  { name: "Logan Sargeant", age: 23, debutYear: 2024, team: "Williams" },
  { name: "Jack Doohan", age: 21, debutYear: 2024, team: "Alpine" }
];

// Function to select a random driver
function selectRandomDriver() {
  const index = Math.floor(Math.random() * f1Drivers.length);
  return f1Drivers[index]; // Return the entire driver object
}

// Function to get a random hint excluding the selected driver
function getRandomHint(selectedDriver) {
  const otherDrivers = f1Drivers.filter(driver => driver.name === selectedDriver.name);
  const hintIndex = Math.floor(Math.random() * otherDrivers.length);
  const hintDriver = otherDrivers[hintIndex];

  // Provide a hint based on the selected driver's team or debut year
  const hintType = Math.random() < 0.5 ? "team" : "debutYear";
  return hintType === "team" 
    ? `This driver racing for the team: ${hintDriver.team}` 
    : `This driver was debuted in the year: ${hintDriver.debutYear}`;
}

// Function to start the guessing game
function startGuessingGame() {
  const selectedDriver = selectRandomDriver();
  let attempts = 3; // Number of attempts will be 3
  let guessedCorrectly = false;

  const messageDiv = document.getElementById("messageDiv");
  messageDiv.innerHTML = "Guess the F1 driver! You have " + attempts + " attempts.";

  const submitButton = document.getElementById("submit-guess");
  
  submitButton.addEventListener("click", function() {
      const userGuess = document.getElementById("guess-input").value; // Get user input from the input field

      if (userGuess && userGuess.toLowerCase() === selectedDriver.name.toLowerCase()) {
          messageDiv.innerHTML = "Congratulations! You guessed correctly: " + selectedDriver.name;
          guessedCorrectly = true;
          submitButton.disabled = true; // Disable the button on correct guess
      } else {
          attempts--;
          const hint = getRandomHint(selectedDriver);
          messageDiv.innerHTML = "Wrong guess! You have " + attempts + " attempts left. Here's a hint: " + hint;
      }

      if (attempts === 0 && !guessedCorrectly) {
          messageDiv.innerHTML = "Sorry, you've run out of attempts! The correct answer was: " + selectedDriver.name;
          submitButton.disabled = true; // Disable the button when attempts are exhausted
      }
  });
}

// Start the game
startGuessingGame();