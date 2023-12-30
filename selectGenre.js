document.addEventListener("DOMContentLoaded", function () {

  const apiKey = "1bfdbff05c2698dc917dd28c08d41096";
  const discoverEndpoint = "https://api.themoviedb.org/3/discover/movie";
  const genreListEndpoint = "https://api.themoviedb.org/3/genre/movie/list";
  const movieDetailsEndpoint = "https://api.themoviedb.org/3/movie";

  // Fetch the list of genres
  fetch(`${genreListEndpoint}?api_key=${apiKey}&language=en-US`)
    .then(response => response.json())
    .then(data => {
      displayGenreDropdown(data.genres);
      const defaultGenreId = data.genres[0].id;
      document.getElementById("genre-dropdown").value = defaultGenreId;

      const movieIdFromUrl = getMovieIdFromUrl();
      fetchMoviesByGenre(defaultGenreId, movieIdFromUrl);
    })
    .catch(error => console.error("Error fetching genres:", error));

  function displayGenreDropdown(genres) {
    const genreDropdown = document.getElementById("genre-dropdown");

    genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreDropdown.appendChild(option);
    });

    genreDropdown.addEventListener("change", function () {
      const selectedGenreId = this.value;
      const movieIdFromUrl = getMovieIdFromUrl();
      fetchMoviesByGenre(selectedGenreId, movieIdFromUrl);
    });
  }

  function fetchMoviesByGenre(genreId) {
    fetch(`${discoverEndpoint}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`)
      .then(response => response.json())
      .then(data => {
        const promises = data.results.map(movie => fetch(`${movieDetailsEndpoint}/${movie.id}?api_key=${apiKey}&language=en-US`));
        return Promise.all(promises);
      })
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(detailedMovies => {
        displayMovies(detailedMovies);
        attachClickEventListeners(); // Attach click event listeners after displaying movies
      })
      .catch(error => console.error("Error fetching movies:", error));
  }

  function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('movieId');
  }

  function displayMovies(movies) {
    const movieContainer = document.getElementById("selected-genre-movies");
    movieContainer.innerHTML = "";

    const moviesToDisplay = movies.slice(0, 16);

    moviesToDisplay.forEach(movie => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.dataset.movieId = movie.id;

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

      movieContainer.appendChild(movieCard);
    });
  }

  function attachClickEventListeners() {
    const movieCards = document.querySelectorAll(".movie-card");
    movieCards.forEach(card => {
      card.addEventListener("click", () => handleMovieCardClick(card.dataset.movieId));
    });
  }

  function handleMovieCardClick(clickedMovieId) {
    // Set the movieId value based on the clicked movie card
    movieId = clickedMovieId;

    // Log the movieId value to check if it's set correctly
    console.log("Clicked Movie ID:", movieId);

    // Redirect to movie-info.html with the movie ID as a query parameter
    window.location.href = `movie-info.html?movieId=${movieId}`;
  }
});
