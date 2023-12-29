let movieId;

async function fetchData() {
    const apiKey = '1bfdbff05c2698dc917dd28c08d41096';
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

    try {
        // Use Axios to make the request for movie details
        const movieResponse = await axios.get(apiUrl);
        const movieData = movieResponse.data;

        // Use Axios to make the request for movie credits
        const creditsResponse = await axios.get(creditsUrl);
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

// Set the movieId value
movieId = 24428;

// Call the fetchData function
fetchData();
