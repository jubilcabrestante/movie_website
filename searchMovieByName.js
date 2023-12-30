// Function to display movies in the UI
function displayMovies(movies) {
    const movieContainer = document.querySelector("#movie-list"); // Use ID for the query selector
    movieContainer.innerHTML = ""; // Clear previous content
  
    // Limit the number of movies to display
    const maxMovies = 4;
    const moviesToDisplay = movies.slice(0, maxMovies);
  
    moviesToDisplay.forEach(movie => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.setAttribute("data-movie-id", movie.id); // Set data attribute with movie ID
  
      // Add click event listener to each movie card
      movieCard.addEventListener("click", () => handleMovieCardClick(movie.id));
  
      // Add double-click event listener to each movie card
      movieCard.addEventListener("dblclick", () => handleMovieCardDoubleClick(movie.id));
  
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
  