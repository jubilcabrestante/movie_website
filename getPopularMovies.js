document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "1bfdbff05c2698dc917dd28c08d41096";
    const popularMoviesEndpoint = "https://api.themoviedb.org/3/movie/popular";
    const movieDetailsEndpoint = "https://api.themoviedb.org/3/movie"; // New endpoint for movie details
      
    // Fetch popular movies
    fetch(`${popularMoviesEndpoint}?api_key=${apiKey}&language=en-US&page=1`)
      .then(response => response.json())
      .then(data => {
        // Fetch detailed information for each popular movie
        const promises = data.results.map(movie => fetch(`${movieDetailsEndpoint}/${movie.id}?api_key=${apiKey}&language=en-US`));
        return Promise.all(promises);
      })
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(detailedMovies => {
        displayPopularMovies(detailedMovies);
      })
      .catch(error => console.error("Error fetching popular movies:", error));
  
    // Display popular movies in the UI
    function displayPopularMovies(movies) {
      const movieContainer = document.querySelector(".popular-movies");
      movieContainer.innerHTML = ""; // Clear previous content
  
      // Limit the number of popular movies to display to a maximum of 16
      const popularMoviesToDisplay = movies.slice(0, 16);
  
      popularMoviesToDisplay.forEach(movie => {
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
