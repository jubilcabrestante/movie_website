document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "1bfdbff05c2698dc917dd28c08d41096";
    const discoverEndpoint = "https://api.themoviedb.org/3/discover/movie";
    const genreListEndpoint = "https://api.themoviedb.org/3/genre/movie/list";
    const movieDetailsEndpoint = "https://api.themoviedb.org/3/movie"; // New endpoint for movie details
  
    // Fetch the list of genres
    fetch(`${genreListEndpoint}?api_key=${apiKey}&language=en-US`)
      .then(response => response.json())
      .then(data => {
        displayGenreDropdown(data.genres);
        // Select a default genre and trigger the change event
        const defaultGenreId = data.genres[0].id; // Assuming the first genre is the default
        document.getElementById("genre-dropdown").value = defaultGenreId;
        fetchMoviesByGenre(defaultGenreId);
      })
      .catch(error => console.error("Error fetching genres:", error));
  
    // Display genre dropdown options
    function displayGenreDropdown(genres) {
      const genreDropdown = document.getElementById("genre-dropdown");
  
      genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreDropdown.appendChild(option);
      });
  
      // Add event listener to the dropdown for automatic fetching
      genreDropdown.addEventListener("change", function () {
        const selectedGenreId = this.value;
        fetchMoviesByGenre(selectedGenreId);
      });
    }
  
    // Fetch movies based on the selected genre
    function fetchMoviesByGenre(genreId) {
      fetch(`${discoverEndpoint}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`)
        .then(response => response.json())
        .then(data => {
          // Fetch detailed information for each movie
          const promises = data.results.map(movie => fetch(`${movieDetailsEndpoint}/${movie.id}?api_key=${apiKey}&language=en-US`));
          return Promise.all(promises);
        })
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(detailedMovies => {
          displayMovies(detailedMovies);
        })
        .catch(error => console.error("Error fetching movies:", error));
    }
  
    // Display movies in the UI
    function displayMovies(movies) {
      const movieContainer = document.getElementById("selected-genre-movies");
      movieContainer.innerHTML = ""; // Clear previous content
  
      // Limit the number of movies to display to a maximum of 12
      const moviesToDisplay = movies.slice(0, 16);
  
      moviesToDisplay.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
  
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
  
        // Check if movie.genres is defined and is an array
        if (Array.isArray(movie.genres)) {
          genre.textContent = "Genres: " + movie.genres.map(genre => genre.name).join(", ");
        } else {
          genre.textContent = "Genres: N/A";
        }
  
        genre.id = "movie-genre";
  
        // Append elements to their respective containers
        imgDiv.appendChild(img);
        movieInfoContainer.appendChild(title);
        movieInfoContainer.appendChild(releaseDate);
        movieInfoContainer.appendChild(genre);
  
        movieCard.appendChild(imgDiv);
        movieCard.appendChild(movieInfoContainer);
  
        movieContainer.appendChild(movieCard);
      });
    }
  });
  