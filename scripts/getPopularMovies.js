document.addEventListener("DOMContentLoaded", function () {
  // Declare movieId as a global variable

  // API key and endpoints
  const apiKey = "1bfdbff05c2698dc917dd28c08d41096";
  const popularMoviesEndpoint = "https://api.themoviedb.org/3/movie/popular";
  const movieDetailsEndpoint = "https://api.themoviedb.org/3/movie";

  // Fetch popular movies
  fetch(`${popularMoviesEndpoint}?api_key=${apiKey}&language=en-US&page=1`)
    .then(response => response.json())
    .then(data => {
      // Get an array of movie IDs
      const movieIds = data.results.map(movie => movie.id);

      // Fetch detailed information for each popular movie
      const promises = movieIds.map(movieId => fetch(`${movieDetailsEndpoint}/${movieId}?api_key=${apiKey}&language=en-US`));
      return Promise.all(promises)
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(detailedMovies => {
          displayPopularMovies(detailedMovies);

          // Add double click event listeners to movie cards
          const movieCards = document.querySelectorAll(".movie-card");
          movieCards.forEach(card => {
            card.addEventListener("dblclick", () => handleMovieCardDoubleClick(card.dataset.movieId));
          });
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
  
      // Call the fetchData function to retrieve movie details using the extracted movieId
      fetchData(movieId);
    }
  
    // Handle movie card double-click event
    function handleMovieCardDoubleClick(clickedMovieId) {
      // Redirect to movie-info.html with the movieID of the clicked similar movie
      window.location.href = `movie-info.html?movieId=${clickedMovieId}`;
    }
  
    // Function to fetch detailed information for a movie
    async function fetchData(movieId) {
      try {
        // Fetch detailed information for the selected movie
        const response = await fetch(`${movieDetailsEndpoint}/${movieId}?api_key=${apiKey}&language=en-US`);
        const detailedMovie = await response.json();
  
        // Log the detailed movie information
        console.log("Detailed Movie Information:", detailedMovie);
  
        // You can now use the detailedMovie data to update the UI or perform other actions
      } catch (error) {
        console.error("Error fetching detailed movie information:", error);
      }
    }
});
