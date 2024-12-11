// const apiUrl = "https://ergast.com/api/f1/drivers.json";
const apiUrl = "http://localhost:3000/api/drivers";
let currentDriver = null;

//---------------------------------------------------------------------------------

const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 3000;

app.get("/api/drivers", async (req, res) => {
  try {
    const response = await fetch("https://ergast.com/api/f1/drivers.json");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching drivers" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// -----------------------------------------------------------------------------------

async function fetchDrivers() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los pilotos");
      }
      const data = await response.json();
      return data.MRData.DriverTable.Drivers;
    } catch (error) {
      document.getElementById("feedback").textContent = "No se pudieron cargar los datos. Intente más tarde.";
      console.error(error);
      return [];
    }
  }

async function fetchDriverStandings(driverId) {
  try {
    const response = await fetch(
      `https://ergast.com/api/f1/driverStandings/${driverId}/drivers.json`
    );
    if (!response.ok) {
      throw new Error("Error de conexión");
    }
    const data = await response.json();
    return data.MRData.StandingsTable.StandingsLists;
  } catch (error) {
    console.error("Error fetching resultados de pilotos:", error);
    return []; // Retorna un array vacío en caso de error
  }
}

async function fetchDriverResults(driverId) {
  const response = await fetch(
    `https://ergast.com/api/f1/drivers/${driverId}/results.json`
  );
  const data = await response.json();
  return data.MRData.RaceTable.Races;
}

function getRandomDriver(drivers) {
  const randomIndex = Math.floor(Math.random() * drivers.length);
  return drivers[randomIndex];
}

async function getBestSeason(driver) {
  const standings = await fetchDriverStandings(driver.driverId);
  let bestSeason = "";
  let bestPosition = Infinity; // Inicializa con un valor alto

  standings.forEach((season) => {
    season.Standings.forEach((entry) => {
      if (entry.Driver.driverId === driver.driverId) {
        const position = parseInt(entry.position);
        if (position < bestPosition) {
          bestPosition = position;
          bestSeason = season.season;
        }
      }
    });
  });

  return bestSeason;
}

async function getStrongestTeam(driver) {
    const results = await fetchDriverResults(driver.driverId);
    const teamWins = {};
  
    results.forEach((result) => {
      const teamId = result.Constructor.constructorId; // ID del constructor
      if (!teamWins[teamId]) {
        teamWins[teamId] = 0;
      }
      teamWins[teamId] += 1; // Contar las victorias
    });
  
    // Encontrar el equipo con más victorias
    let strongestTeam = "";
    let maxWins = 0;
    for (const teamId in teamWins) {
      if (teamWins[teamId] > maxWins) {
        maxWins = teamWins[teamId];
        strongestTeam = teamId; // Asignar el ID más fuerte
      }
    }
  
    // Mapear el ID del constructor al nombre real
    return constructorMap[strongestTeam] || "Desconocido";
  }

async function startGame() {
  const drivers = await fetchDrivers();
  currentDriver = getRandomDriver(drivers);

  // Obtener la mejor temporada y el equipo más fuerte del piloto
  currentDriver.bestSeason = await getBestSeason(currentDriver);
  currentDriver.strongestTeam = await getStrongestTeam(currentDriver);

  displayHints(currentDriver);
}

function displayHints(driver) {
  const hintsContainer = document.getElementById("hints");
  hintsContainer.innerHTML = `
        <p>Pista 1: Mejor época - ${driver.bestSeason}</p>
        <p>Pista 2: Equipo más fuerte - ${driver.strongestTeam}</p>
    `;
}

document.getElementById("submit-guess").addEventListener("click", () => {
  const guessInput = document.getElementById("guess-input").value;
  const feedback = document.getElementById("feedback");

  if (guessInput.toLowerCase() === currentDriver.familyName.toLowerCase()) {
    feedback.textContent = "¡Correcto! Has adivinado el piloto.";
  } else {
    feedback.textContent = "Incorrecto. Intenta de nuevo.";
  }
});

startGame();
