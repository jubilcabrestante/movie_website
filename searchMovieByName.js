document.addEventListener("DOMContentLoaded", function () {
  let movieId; // Declare movieId as a global variable

  const apiKey = "1bfdbff05c2698dc917dd28c08d41096";
  const movieSearchEndpoint = "https://api.themoviedb.org/3/search/movie";
  const movieDetailsEndpoint = "https://api.themoviedb.org/3/movie";

  // Function to search for a movie based on its name and display the results
  function searchMovieByName(movieName) {
      fetch(`${movieSearchEndpoint}?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`)
          .then(response => response.json())
          .then(searchData => {
              if (searchData.results && searchData.results.length > 0) {
                  displayMovies(searchData.results);
              } else {
                  console.log("No results found for the given movie name.");
              }
          })
          .catch(error => console.error("Error fetching search results:", error));
  }

  // Function to display movies in the UI
  function displayMovies(movies) {
      const movieContainer = document.querySelector("#movie-list"); // Use ID for the query selector
      movieContainer.innerHTML = ""; // Clear previous content

      movies.forEach(movie => {
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

          // Fetch genre information using the movie ID
          fetch(`${movieDetailsEndpoint}/${movie.id}?api_key=${apiKey}&language=en-US`)
              .then(response => response.json())
              .then(detailedMovie => {
                  if (Array.isArray(detailedMovie.genres)) {
                      genre.textContent = "Genres: " + detailedMovie.genres.map(genre => genre.name).join(", ");
                  } else {
                      genre.textContent = "Genres: N/A";
                  }
              })
              .catch(error => console.error("Error fetching genre information:", error));

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

  // Handle movie card click event
  function handleMovieCardClick(clickedMovieId) {
      // Set the movieId value based on the clicked movie card
      movieId = clickedMovieId;

      // Log the movieId value to check if it's set correctly
      console.log("Clicked Movie ID:", movieId);

      // Redirect to movie-info.html with the movie ID as a query parameter
      window.location.href = `movie-info.html?movieId=${movieId}`;
  }

  // Handle movie card double-click event
  function handleMovieCardDoubleClick(clickedMovieId) {
      // Set the movieId value based on the double-clicked movie card
      movieId = clickedMovieId;

      // Log the movieId value to check if it's set correctly
      console.log("Double-Clicked Movie ID:", movieId);

      // Redirect to movie-info.html with the movie ID as a query parameter
      window.location.href = `movie-info.html?movieId=${movieId}`;
  }

  // Get the search form
  const searchForm = document.getElementById("form");

  // Add submit event listener to the search form
  searchForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting in the traditional way

      // Get the search term from the input field
      const searchInput = document.getElementById("search");

      // Example usage of searchMovieByName function with dynamically obtained search term
      searchMovieByName(searchInput.value);
  });
});
