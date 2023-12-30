document.addEventListener("DOMContentLoaded", function () {
    // Function to get the movieId from the URL
    function getMovieIdFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('movieId');
    }
  
    let movieId = getMovieIdFromUrl(); // Get movieId from the URL
    const apiKey = "1bfdbff05c2698dc917dd28c08d41096";
    const movieDetailsEndpoint = "https://api.themoviedb.org/3/movie"; // New endpoint for movie details
  
    // Fetch Similar movies
    fetch(`${movieDetailsEndpoint}/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`)
      .then(response => response.json())
      .then(data => {
        // Display Similar movies in the UI
        displaySimilarMovies(data.results);
  
        // Add click event listeners to movie cards
        const movieCards = document.querySelectorAll(".movie-card");
        movieCards.forEach(card => {
          card.addEventListener("click", () => handleMovieCardClick(card.dataset.movieId));
          card.addEventListener("dblclick", () => handleMovieCardDoubleClick(card.dataset.movieId));
        });
      })
      .catch(error => console.error("Error fetching similar movies:", error));
  
    function displaySimilarMovies(similarMovies) {
      // Display similar movies in the UI
      const similarMoviesContainer = document.querySelector(".similar-movies");
      similarMoviesContainer.innerHTML = ""; // Clear previous content
  
      const similarMoviesToDisplay = similarMovies.slice(0, 10);
  
      similarMoviesToDisplay.forEach(similarMovie => {
        const similarMovieCard = createSimilarMovieCard(similarMovie);
        similarMoviesContainer.appendChild(similarMovieCard);
      });
    }
  
    // Function to create a similar movie card
    function createSimilarMovieCard(movie) {
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
  
      if (Array.isArray(movie.genre_ids)) {
        // Fetch genre names using genre IDs
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
          .then(response => response.json())
          .then(data => {
            const genres = data.genres.filter(genre => movie.genre_ids.includes(genre.id)).map(genre => genre.name);
            genre.textContent = "Genres: " + genres.join(", ");
          })
          .catch(error => console.error("Error fetching genre names:", error));
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
  