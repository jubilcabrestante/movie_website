// fetchData.js

// Function to extract the movie ID from the URL
function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('movieId');
}

// Function to fetch movie data
async function fetchData() {
    // Get the movie ID from the URL
    const movieId = getMovieIdFromUrl();

    // If there's no movieId in the URL, do nothing
    if (!movieId) {
        console.error('No movieId found in the URL');
        return;
    }

    const apiKey = '1bfdbff05c2698dc917dd28c08d41096';
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

    try {
        // Use Axios to make the request for movie details
        const [movieResponse, creditsResponse] = await Promise.all([
            axios.get(apiUrl),
            axios.get(creditsUrl)
        ]);

        const movieData = movieResponse.data;
        const creditsData = creditsResponse.data;

        // Populate HTML elements with movie details
        document.getElementById('movie-title').textContent = movieData.title;
        document.getElementById('movie-genre').textContent = movieData.genres.map(genre => genre.name).join(', ');
        document.getElementById('release-date').textContent = movieData.release_date;
        document.getElementById('origin-country').textContent = movieData.production_countries.map(country => country.name).join(', ');
        document.getElementById('vote-average').textContent = movieData.vote_average;
        document.getElementById('overview').textContent = movieData.overview;

        // Extract and display director information
        const director = creditsData.crew.find(member => member.job === 'Director');
        document.getElementById('director').textContent = director ? director.name : 'Not available';

        // Extract and display producers information
        const producers = creditsData.crew.filter(member => member.job === 'Producer').map(member => member.name);
        document.getElementById('producers').textContent = producers.length > 0 ? producers.join(', ') : 'Not available';

        // Extract and display cast information for a minimum of 10 members excluding star actors
        const nonStarActors = creditsData.cast.filter(member => member.order < 10 && member.star !== true).map(member => member.name);
        document.getElementById('cast').textContent = nonStarActors.length > 0 ? nonStarActors.join(', ') : 'Not available';

        document.getElementById('vote-count').textContent = movieData.vote_count;
        document.getElementById('popularity').textContent = movieData.popularity;

        // Set movie image source
        document.getElementById('movie-image').src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the fetchData function to retrieve movie details using the extracted movie ID
fetchData();
