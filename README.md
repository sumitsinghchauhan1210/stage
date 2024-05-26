# Add to my List feature for OTT apps

Welcome to our NestJS project! This is a brief guide to get you started with running and exploring our application.

## Prerequisites

Before running the application, ensure you have the following prerequisites installed on your machine:

- Node.js v18 or above
- Docker
- Docker Compose

## Getting Started

To start the project locally, use the following command:

```bash
docker-compose up --build
```

## Application Deployment

The application is deployed and accessible at the following URLs:

Swagger Documentation: http://13.201.59.46:3000/api

## API Endpoints

The application exposes the following API endpoints:

- GET /users/{userId}/list: Lists all items added to the user's list with pagination.
- POST /users/{userId}/list: Adds items to the user's list.
- DELETE /users/{userId}/list/{contentId}: Removes an item from the user's list.
- GET /user: Gets a list of users with pagination.
- GET /movies: Lists all movies.
- POST /movies: Adds a new movie.
- GET /tvshows: Lists all TV shows.
- POST /tvshows: Adds a TV show.

## Database

The database is pre-seeded with sample data for testing the application features.

Feel free to explore the application using the provided endpoints and have fun! If you encounter any issues or have questions, don't hesitate to reach out to us. Happy coding! 🚀
