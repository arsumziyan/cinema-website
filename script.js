document.addEventListener('DOMContentLoaded', () => {
    let allMovies = [];
    let allGenres = [];
    
    function fetchMovies() {
        fetch('http://localhost:3000/movies')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch movies.');
                }
                return response.json();
            })
            .then(movies => {
                allMovies = movies;
                displayMovies(allMovies);
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

    function displayMovies(movies) {
        const movieList = document.getElementById('movie-list');
        movieList.innerHTML = '';
        
        for (let i=0; i<movies.length-1; i++){
            for (let j=0; j<movies.length-1-i; j++){
                if (movies[j].title.toUpperCase() > movies[j+1].title.toUpperCase()){
                    let temp = movies[j];
                    movies[j] = movies[j+1];
                    movies[j+1] = temp;
                }
            }
        }
        console.log('Movies:', movies);

        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
    
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            if (Array.isArray(movie.images) && movie.images.length > 0) {
                movie.images.forEach(imgObj => {
                    const imgUrl = `http://localhost:3000/movies/${imgObj.url}`;
                    const imgElement = document.createElement('img');
                    imgElement.src = imgUrl;
                    imageContainer.appendChild(imgElement);
                });
            }
            movieElement.appendChild(imageContainer);
            movieElement.innerHTML += `
                <h2>${movie.title}</h2>
                <p class="genres">Genres: ${movie.genres ? movie.genres.map(genre => genre.type).join(', ') : 'N/A'}</p>
                <p>${movie.description}</p>
                <button class="booking">Book Now</button>
            `;
            movieList.appendChild(movieElement);
        });
    }
    function fetchGenres() {
        fetch('http://localhost:3000/genres')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch genres.');
                }
                return response.json();
            })
            .then(genres => {
                allGenres = genres;
                displayGenres(allGenres);
            })
            .catch(error => console.error('Error fetching genres:', error));
    }

    function displayGenres(genres) {
        const genresContainer = document.getElementById('genresContainer');
        genresContainer.innerHTML = '<h3>Select Genres</h3>';
    
        genres.forEach(genre => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = genre._id;
            checkbox.name = 'genres'; 
            checkbox.value = genre.type;
    
            const label = document.createElement('label');
            label.htmlFor = genre._id;
            label.innerText = genre.type;
    
            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);
    
            genresContainer.appendChild(div);
        });
    }

    fetchMovies();
    fetchGenres();

    document.getElementById('searchForm').addEventListener('input', function(e) {
        e.preventDefault();
        const searchQuery = document.getElementById('searchBar').value.toLowerCase(); 
        console.log('Searching for movies:', searchQuery);
        
        const filteredMovies = allMovies.filter(movie => {
            const titleMatches = movie.title.toLowerCase().includes(searchQuery);
            const genreMatches = movie.genres && movie.genres.some(genre => genre.type.toLowerCase().includes(searchQuery));
            return titleMatches || genreMatches;
        });
        displayMovies(filteredMovies); 
    });

    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Movie Name Element:', document.getElementById('MovieName'));
        console.log('Movie Description Element:', document.getElementById('MovieDescription'));
        console.log('Image File Element:', document.getElementById('imageFile'));
        console.log('Poster URL Element:', document.getElementById('posterUrl'));

        const movieNameElement = document.getElementById('MovieName');
        const movieDescriptionElement = document.getElementById('MovieDescription');
        const imageFileElement = document.getElementById('imageFile');
        const posterUrlElement = document.getElementById('posterUrl');
        const selectedGenres = Array.from(document.querySelectorAll('input[name="genres"]:checked')).map(checkbox => checkbox.id);
    

        if (!movieNameElement || !movieDescriptionElement || !imageFileElement || !posterUrlElement) {
            console.error('One or more form elements are missing');
            return;
        }

        const movieName = movieNameElement.value;
        const movieDescription = movieDescriptionElement.value;
        const imageFile = imageFileElement.files;
        const posterUrl = posterUrlElement.value;

        if (imageFile.length === 0 && !posterUrl) {
            alert('Please select or paste an image.');
            return;
        }

        const formData = new FormData();
        formData.append('MovieName', movieName);
        formData.append('MovieDescription', movieDescription);

        for (let i = 0; i < imageFile.length; i++) {
            formData.append('images', imageFile[i]);
            console.log('Image file added to form data:', imageFile[i].name);
        }
        if (posterUrl) {
            formData.append('posterUrl', posterUrl);
            console.log('Poster URL added to form data:', posterUrl);
        }

        selectedGenres.forEach(genreId => {
            formData.append('genres', genreId); 
        });
                                

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to upload the image.');
            }
            return response.text();
        })
        .then(result => {
            console.log('Upload successful:', result);
            location.reload();
        })
        .catch(error => console.error('Error uploading image:', error));
    });
});