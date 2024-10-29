# Battleship

A simple web-based version of the classic Battleship board game, developed with React and Firebase. The app features a responsive design using Tailwind CSS and includes unit tests to ensure reliable gameplay. Additionally, it is set up with a GitHub Actions workflow that runs tests, builds a Docker image, and publishes it to Docker Hub, along with security analysis through CodeQL.

### How to run

- Config your firebase environment variables in the .env file
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
- Install dependecies
```
npm install
```
- Run, make sure port 8000 is available
```
npm run dev
```


### Run test

```
npm run test
```

or:

```
npm run coverage
```

### Build docker image

```
docker build -t battleship
```