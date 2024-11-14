const API_KEY = "eca1efd2c9msh6f47c703a1a5ff2p19aa90jsn3341ebea3870";
const API_HOST = "free-to-play-games-database.p.rapidapi.com";

const getGames = async (category = "") => {
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": API_HOST,
    },
  };

  let url = `https://${API_HOST}/api/games`;
  if (category && category !== "all") {
    url += `?category=${category}`;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

const displayGames = (games) => {
  const gamesList = document.getElementById("gamesList");
  gamesList.innerHTML = "";

  games.forEach((game) => {
    const gameCard = `
            <div class="col">
                <div class="card h-100">
                    <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}">
                    <div class="card-body">
                        <h5 class="card-title">${game.title}</h5>
                        <p class="card-text">${game.short_description}</p>
                        <a href="${game.game_url}" target="_blank" class="btn btn-primary">Play Game</a>
                        <ul class="list-group list-group-flush mt-3">
                            <li class="list-group-item"><strong>Genre:</strong> ${game.genre}</li>
                            <li class="list-group-item"><strong>Platform:</strong> ${game.platform}</li>
                            <li class="list-group-item"><strong>Developer:</strong> ${game.developer}</li>
                            <li class="list-group-item"><strong>Release Date:</strong> ${game.release_date}</li>
                        </ul>
                    </div>
                    <div class="card-footer">
                        <a href="${game.freetogame_profile_url}" target="_blank" class="btn btn-secondary btn-sm">View Profile</a>
                    </div>
                </div>
            </div>
        `;
    gamesList.innerHTML += gameCard;
  });
};

const filterGames = (games, searchTerm) => {
  return games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const init = async () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const searchInput = document.getElementById("searchInput");
  let allGames = [];

  navLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      const category = link.dataset.category;
      allGames = await getGames(category);
      displayGames(allGames);
      searchInput.value = ""; // Clear search input when changing categories
    });
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value;
    const filteredGames = filterGames(allGames, searchTerm);
    displayGames(filteredGames);
  });

  // Load all games by default
  allGames = await getGames();
  displayGames(allGames);
};

document.addEventListener("DOMContentLoaded", init);
