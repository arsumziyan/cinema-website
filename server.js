const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json({ limit: '50kb' }));
app.use('/movies', express.static(path.join(__dirname, 'movies')));

mongoose.connect('mongodb://localhost:27017/ArsumDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});
const Movie = mongoose.model('Movie', movieSchema);

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
});
const Image = mongoose.model('Image', imageSchema);

const genrecollectionSchema = new mongoose.Schema({
    type: { type: String, required: true }
});

const GenresCollection = mongoose.model('Genres_Collection', genrecollectionSchema, 'genres_collection');

const genreMovieAssociationSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie'},
    genreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genres_Collection'}
});

const GenreMovieAssociation = mongoose.model('Genre_Movie_Association', genreMovieAssociationSchema);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'movies/');
    },
    filename: (req, file, cb) => {;
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage });

app.get('/genres', async (req, res) => {
    try {
        const genres = await GenresCollection.find(); 
        res.json(genres);
    } catch (error) {
        console.error('Error retrieving genres:', error);
        res.status(500).send('Error retrieving genres.');
    }
});



app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        const moviesWithImages = await Promise.all(movies.map(async (movie) => {
            const images = await Image.find({ movie: movie._id });
            const genreAssociations = await GenreMovieAssociation.find({ movieId: movie._id }).populate('genreId');
            return {
                _id: movie._id,
                title: movie.title,
                description: movie.description,
                images: images.map(image => ({ url: image.url, _id: image._id })),
                genres: genreAssociations.map(assoc => assoc.genreId)
            };
        }));
        
        res.json(moviesWithImages);
    } catch (error) {
        console.error('Error retrieving movies:', error);
        res.status(500).send('Error retrieving movies.');
    }
});

app.post('/upload', upload.array('images'), async (req, res) => {
    const { MovieName, MovieDescription, posterUrl } = req.body;
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);

    try {
        if (!MovieName || !MovieDescription) {
            return res.status(400).send('Missing required fields.');
        }
        const movie = new Movie({
            title: MovieName,
            description: MovieDescription,
        });
        await movie.save();

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const newImage = new Image({ 
                    url: `${file.originalname}`,
                    movie: movie._id
                });
                await newImage.save();
            }
        }

        if (posterUrl) {
            const newImage = new Image({ 
                url: posterUrl,
                movie: movie._id 
            });
            await newImage.save();
        }

        if (req.body.genres) {
            const genres = Array.isArray(req.body.genres) ? req.body.genres : [req.body.genres];
            for (const genreId of genres) {
                console.log(`Associating movie ${movie._id} with genre ${genreId}`);
                const genreAssociation = new GenreMovieAssociation({
                    movieId: movie._id,
                    genreId: genreId
                });
                await genreAssociation.save();
            }
        }


        res.send('Movie uploaded and saved successfully.');
    } catch (error) {
        console.error('Error saving movie:', error);
        res.status(500).send('Error saving movie: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
