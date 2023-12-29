const apiKey = "1bfdbff05c2698dc917dd28c08d41096"; // Replace with your API key
const genreEndpoint = "https://api.themoviedb.org/3/genre/movie/list?api_key=1bfdbff05c2698dc917dd28c08d41096&language=en-US";

// Make API request
fetch(`${genreEndpoint}?api_key=${apiKey}&language=en-US`)
  .then(response => response.json())
  .then(data => {
    // Process the data (e.g., display genres)
    console.log(data.genres);
    // You can use this data to populate your user interface
  })
  .catch(error => console.error("Error fetching genres:", error));
