import { connect, disconnect, Schema, model } from 'mongoose';

console.log('Starting the seed script');

const UserSchema = new Schema({
  username: { type: String, required: true },
  favoriteGenres: [{ type: String }],
  dislikedGenres: [{ type: String }],
  watchHistory: [
    {
      contentId: { type: String },
      watchedOn: { type: Date },
      rating: { type: Number },
    },
  ],
  myList: [{ contentId: { type: String }, contentType: { type: String } }],
});

const UserModel = model('User', UserSchema);

const TVShowSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String }],
  episodes: [
    {
      episodeNumber: { type: Number },
      seasonNumber: { type: Number },
      releaseDate: { type: Date },
      director: { type: String },
      actors: [{ type: String }],
    },
  ],
});

const TVShowModel = model('TVShow', TVShowSchema);

const MovieSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String }],
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  actors: [{ type: String }],
});

const MovieModel = model('Movie', MovieSchema);

async function seedDatabase() {
  console.log('Seeding the database...');
  try {
    await connect(process.env.MONGO_URL);

    await UserModel.deleteMany({});
    await TVShowModel.deleteMany({});
    await MovieModel.deleteMany({});

    await UserModel.create([
      {
        username: 'user1',
        favoriteGenres: ['Action'],
        dislikedGenres: ['Romance'],
        watchHistory: [],
        myList: [],
      },
      {
        username: 'user2',
        favoriteGenres: ['Comedy'],
        dislikedGenres: ['Horror'],
        watchHistory: [],
        myList: [],
      },
    ]);

    await TVShowModel.create([
      {
        title: 'TV Show 1',
        description: 'Description 1',
        genres: ['Action'],
        episodes: [],
      },
      {
        title: 'TV Show 2',
        description: 'Description 2',
        genres: ['Comedy'],
        episodes: [],
      },
    ]);

    await MovieModel.create([
      {
        title: 'Movie 1',
        description: 'Description 1',
        genres: ['Drama'],
        releaseDate: new Date(),
        director: 'Director 1',
        actors: [],
      },
      {
        title: 'Movie 2',
        description: 'Description 2',
        genres: ['Fantasy'],
        releaseDate: new Date(),
        director: 'Director 2',
        actors: [],
      },
    ]);
  } catch (error) {
    console.error('Error seeding mock data:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
