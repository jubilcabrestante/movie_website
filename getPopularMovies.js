document.addEventListener("DOMContentLoaded", function () {
  let movieId;  // Declare movieId as a global variable

  const apiKey = "1bfdbff05c2698dc917dd28c08d41096";
  const popularMoviesEndpoint = "https://api.themoviedb.org/3/movie/popular";
  const movieDetailsEndpoint = "https://api.themoviedb.org/3/movie"; // New endpoint for movie details

  // Fetch popular movies
  fetch(`${popularMoviesEndpoint}?api_key=${apiKey}&language=en-US&page=1`)
    .then(response => response.json())
    .then(data => {
      // Get an array of movie IDs
      const movieIds = data.results.map(movie => movie.id);

      // Display popular movies in the UI
      displayPopularMovies(data.results);

      // Add click event listeners to movie cards
      const movieCards = document.querySelectorAll(".movie-card");
      movieCards.forEach(card => {
        card.addEventListener("click", () => handleMovieCardClick(card.dataset.movieId));
      });
    })
    .catch(error => console.error("Error fetching popular movies:", error));

  // Display popular movies in the UI
  function displayPopularMovies(movies) {
    const movieContainer = document.querySelector(".popular-movies");
    movieContainer.innerHTML = ""; // Clear previous content

    // Limit the number of popular movies to display to a maximum of 16
    const popularMoviesToDisplay = movies.slice(0, 16);

    popularMoviesToDisplay.forEach(movie => {
      const movieCard = createMovieCard(movie);
      movieContainer.appendChild(movieCard);
    });
  }

  // Function to create a movie card
  function createMovieCard(movie) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.dataset.movieId = movie.id; // Set dataset attribute for movie ID

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("img-div");

    const img = document.createElement("img");
    img.src = `http://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    img.alt = movie.title;
    img.id = "movie-img";

    const movieInfoContainer = document.createElement("div");
    movieInfoContainer.classList.add("movie-info-container");

    const title = document.createElement("h2");
    title.classList.add("f-s-mi");
    title.textContent = movie.title;
    title.id = "movie-title";

    const releaseDate = document.createElement("span");
    releaseDate.classList.add("date-release", "f-s-mi");
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
    releaseDate.id = "movie-release-date";

    const genre = document.createElement("span");
    genre.classList.add("genre", "f-s-mi");

    if (Array.isArray(movie.genres)) {
      genre.textContent = "Genres: " + movie.genres.map(genre => genre.name).join(", ");
    } else {
      genre.textContent = "Genres: N/A";
    }

    genre.id = "movie-genre";

    imgDiv.appendChild(img);
    movieInfoContainer.appendChild(title);
    movieInfoContainer.appendChild(releaseDate);
    movieInfoContainer.appendChild(genre);

    movieCard.appendChild(imgDiv);
    movieCard.appendChild(movieInfoContainer);

    return movieCard;
  }

  // Handle movie card click event
  function handleMovieCardClick(clickedMovieId) {
    // Set the movieId value based on the clicked movie card
    movieId = clickedMovieId;

    // Log the movieId value to check if it's set correctly
    console.log("Clicked Movie ID:", movieId);

    // Call the function to display similar movies
    displaySimilarMovies(movieId);
  }

  // Function to fetch and display similar movies
  function displaySimilarMovies(movieId) {
    const similarMoviesEndpoint = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`;

    fetch(similarMoviesEndpoint)
      .then(response => response.json())
      .then(data => {
        // Display similar movies in the UI
        const similarMoviesContainer = document.querySelector(".similar-movies");
        similarMoviesContainer.innerHTML = ""; // Clear previous content

        const similarMoviesToDisplay = data.results.slice(0, 4);

        similarMoviesToDisplay.forEach(similarMovie => {
          const similarMovieCard = createMovieCard(similarMovie);
          similarMoviesContainer.appendChild(similarMovieCard);
        });
      })
      .catch(error => console.error("Error fetching similar movies:", error));
  }
});