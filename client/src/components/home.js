import React, { Component } from 'react';

// Components
import JoinRoom from './joinroom'

//import AppFunc from '../App-function'
import NewRoom from './newroom'
import Spotify from 'spotify-web-api-js';


class Home extends Component {
    constructor(){
        super();
        const params = this.getHashParams();
        const WebApi = new Spotify();

        this.state ={
            render:'',
            loggedIn: params.access_token ? true : false,
            spotifyWebApi: WebApi,
            userInfo: {
                country: '',
                display_name: '',
                email: '',
                id: '' ,
                images: ''   
            },
            playlists: [],
            devices: []
        }   
        if (params.access_token){
            this.state.spotifyWebApi.setAccessToken(params.access_token);
        }
        if (this.state.loggedIn){
            this.getCurrentUser();
            this.getUserDevices();
            this.getUserPlaylists();
            this.state.render = 'new'
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
        this.state.spotifyWebApi.getMe()
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

    getUserDevices(){
        this.state.spotifyWebApi.getMyDevices()
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

    getUserPlaylists(){
        this.state.spotifyWebApi.getUserPlaylists()
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

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});
    }

    _renderSubComp(){
        switch(this.state.render){
            case 'login': window.location.assign('http://localhost:8888/login')
            case 'new': return <NewRoom {...this.state}/>              
            case 'join': return <JoinRoom/>
            default: return(
                <div className="Home">        
                    <button onClick={this.handleClick.bind(this, 'login')}>New Room</button>
                    <button onClick={this.handleClick.bind(this, 'join')}>Join Room</button>
                </div>
          );
        }
    }

    render() {
      return (
        <div className="Home">          
            {this._renderSubComp()}
        </div>
      );
    }
  }
  
export default Home;