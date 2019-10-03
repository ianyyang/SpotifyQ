import React, {Component} from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

class AppFunc extends Component{
  constructor(){
    super();
    const params = this.getHashParams();
    this.state ={
        loggedIn: params.access_token ? true : false,
        nowPlaying: { 
            name: '', 
            image: '',
        },
        userInfo: {
            country: '',
            display_name: '',
            email: '',
            id: '' ,
            images: ''   
        },
        playlists: [],
        devices: [],
        search: '',
        searchResults: []
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

    // Get the authenticated user
    getCurrentUser(){
        spotifyWebApi.getMe()
        .then((response) =>{
            console.log('User ID:', response.id);
            this.setState({
                userInfo: {
                    country: response.country,
                    display_name: response.display_name,
                    email: response.email,
                    id: response.id
                }
            })

        }, function(err) {
            console.log('Something went wrong!', err);
    });
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
    spotifyWebApi.createPlaylist(this.state.userInfo.id, {'name': 'User Playlist'})
    .then(function(data) {
      alert('New playlist created!', data);
    }, function(err) {
      console.error('Something went wrong!', err);
    })
  }

  resumePlayback(){
    var index = document.getElementById('devices').selectedIndex;
    spotifyWebApi.play({device: this.state.devices[index].id})
    .then(function(data) {
      console.log('Playback resumed!', data);
    }, function(err) {
      console.error('Something went wrong!', err);
    })
  }

  pausePlayback() {
    var index = document.getElementById('devices').selectedIndex;
    spotifyWebApi.pause({device: this.state.devices[index].id})
    .then(function(data) {
      console.log('Playback paused!');
    }, function(err) {
      console.error('Something went wrong!', err);
    });
  }

  searchAll() {
    if (this.state.search === ''){
        this.setState({search: ' '});
    }  

    /*spotifyWebApi.search(this.state.search, ['track'])
    .then((response) => {
      console.log('Search success!', response);
      var json = response.tracks.items;
      var arr = [];

      Object.keys(json).forEach(function(key) {
        arr.push({
            name: json[key].name,
            id: json[key].id
          })
      });

      this.setState({
        searchResults: arr
      }, function(err) {
        console.error('Something went wrong!', err);
      });
    });*/
  }
  
  addTrack() {
    spotifyWebApi.addTracksToPlaylist(this.state.userInfo.id,'7Dcs93HOnJYPL6fJc9yqW2', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"])
    .then(function(data) {
      console.log('Added tracks to playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  MakeItem = function(X) {
    return <option>{X.name}</option>;
  };

  handleChange(event) {
    this.setState({search: event.target.value});
  }

  render(){
      return (
        <div className="App">
            <h1>Hosted By: {this.state.userInfo.display_name}</h1>
            
            <button onClick={() => this.getCurrentUser()}>
                Get User
            </button>
            
            <div> Now Playing: {this.state.nowPlaying.name}</div>
            <div>
            <img src={this.state.nowPlaying.image } style={{width:100}}/>
            </div>
            <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
            </button>

            <div>
            <ul>Playlists:</ul>
                <select>{this.state.playlists.map(this.MakeItem)}</select>
            </div>

            <button onClick={() => this.getUserPlaylists()}>
            Get Playlists
            </button>

            <div>
            <ul>Devices:</ul>
                <select id="devices">{this.state.devices.map(this.MakeItem)}</select>
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

            <button onClick={() => this.searchAll()}>
            Search All
            </button>

            <form onSubmit={this.searchAll()}>
                <label>
                Search:
                <input type="text" value={this.state.search} onChange={this.handleChange.bind(this)} />
                </label>
                <input type="submit" value="Submit" />
            </form>

            <ul>Tracks:
              {(this.state.searchResults || []).map(item => (            
                <li key={item.id}>Name: {item.name}</li>
                ))}
            </ul>

            <button onClick={() => this.addTrack()}>
            Add Track to Playlist
            </button>
        </div>
      );
    }  
}

export default AppFunc;