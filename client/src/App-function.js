import React, {Component} from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

class App extends Component{
  constructor(){
    super();
    const params = this.getHashParams();
    this.state ={
        loggedIn: params.access_token ? true : false,
        nowPlaying: { 
          name: 'Not Checked', 
          image: '',
        },
        playlists: [],
        devices: []
    }
    if (params.access_token){
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyWebApi.getMyCurrentPlaybackState()
    .then((response) => {
      console.log('Now playing successfully captured!', response);

      this.setState({
        nowPlaying: {
          name:response.item.name,
          image: response.item.album.images[0].url
        }
      })
    }, function(err) {
      console.error('Something went wrong!', err);
    });
  }

  getUserPlaylists(){
    spotifyWebApi.getUserPlaylists()
    .then((response) => {
      console.log('User playlists successfully captured!', response);
      
      var json = response.items;
      var arr = [];

      Object.keys(json).forEach(function(key) {
        arr.push({
            name: json[key].name,
            id: json[key].id
          })
      });

      this.setState({
        playlists: arr
      }, function(err) {
        console.error('Something went wrong!', err);
      });
    })
  }

  getUserDevices(){
    spotifyWebApi.getMyDevices()
    .then((response) => {
      console.log('User devices successfully captured!', response);
        
      var json = response.devices;
      var arr = [];

      Object.keys(json).forEach(function(key) {
        arr.push({
            name: json[key].name,
            id: json[key].id
          });
      });

      this.setState({
        devices: arr
      }, function(err) {
        console.error('Something went wrong!', err);
      });
    })
  }

  postNewPlaylist(){
    spotifyWebApi.createPlaylist('spangebobu', {'name': 'User Playlist'})
    .then(function(data) {
      console.log('New playlist created!', data);
    }, function(err) {
      console.error('Something went wrong!', err);
    })
  }

  resumePlayback(){
    spotifyWebApi.play({device: 'c8b21c1c42ad5a09d0d44a150f8508199e301abc'})
    .then(function(data) {
      console.log('Playback resumed!', data);
    }, function(err) {
      console.error('Something went wrong!', err);
    })
  }

  pausePlayback() {
    spotifyWebApi.pause({device: 'c8b21c1c42ad5a09d0d44a150f8508199e301abc'})
    .then(function(data) {
      console.log('Playback paused!');
    }, function(err) {
      console.error('Something went wrong!', err);
    });
  }

  searchAll() {
    spotifyWebApi.search('Love', ['album', 'artist', 'track'])
    .then(function(data) {
      console.log('Search success!');
    }, function(err) {
      console.error('Something went wrong!', err);
    });
  }
  
  addTrack() {
    spotifyWebApi.addTracksToPlaylist('2b9MxDp4N1UgAkzRWvRKQz', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
    .then(function(data) {
      console.log('Added tracks to playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  render(){
      return (
        <div className="App">
          <a href = "http://localhost:8888">
            <button>Login with Spotify</button>
          </a>
        
          <div> Now Playing: {this.state.nowPlaying.name}</div>
          <div>
            <img src={this.state.nowPlaying.image } style={{width:100}}/>
          </div>
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>

          <div>
            <ul>Playlists:
              {(this.state.playlists || []).map(item => (            
                <li key={item.id}>Name: {item.name} <br/> ID: {item.id}</li>
          ))}
            </ul>
          </div>

          <button onClick={() => this.getUserPlaylists()}>
            Get Playlists
          </button>

          <div>
            <ul>Devices:
              {(this.state.devices || []).map(item => (            
                <li key={item.id}>Name: {item.name} <br/> ID: {item.id}</li>
          ))}
            </ul>
          </div>

          <button onClick={() => this.getUserDevices()}>
            Get Devices
          </button>

          <div></div>
          <button onClick={() => this.postNewPlaylist()}>
            Create New Playlist
          </button>          

          <button onClick={() => this.resumePlayback()}>
            Start/Resume Playback
          </button>

          <button onClick={() => this.pausePlayback()}>
            Pause Playback
          </button>

          <div></div>
          <button onClick={() => this.searchAll()}>
            Search All
          </button>

          <button onClick={() => this.addTrack()}>
            (error) Add Track to Playlist
          </button>
        </div>
      );
    }  
}

export default App;