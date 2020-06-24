# RESPIRE
Music referencing app with an audio waveform analyzer and Spotify SDK integration

=======
## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes

### Installation
```
npm install
```

### Running

#### Environment Variables
Set environment variables 'id' (Spotify client ID) and 'secret' (Spotify client secret)

#### With Docker
```
docker-compose up -d
```

#### Without Docker
```
npm run build
npm start
```

Once started, server will be running at `http://localhost:8080/`

## Demo
Render audio waveform images from audio files locally or remotely

![Local](https://github.com/sajjanrajvaidya/mvp/blob/master/Respire%20Local%20Render%20GIF-downsized_large.gif)

Stream reference tracks from Spotify for referencing your mix or master track

![Spotify_I](https://github.com/sajjanrajvaidya/mvp/blob/master/Spotify%20Integration%20Phase%20I%20GIF-downsized_large.gif)

## Built With
* [React](https://reactjs.org/) - Front-end Web Environment
* [Styled-Components](https://styled-components.com/) - Component Level Styles
* [Axios](https://www.npmjs.com/package/axios) - Server interactions
* [Webpack](https://webpack.js.org/) - Client-side bundling

#### Future Builds:
* Cross DOM player synchronization

## Author
[sajjanrajvaidya](https://github.com/sajjanrajvaidya)
