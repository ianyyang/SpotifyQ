import React, { Component } from 'react';

import AppFunc from '../App-function'


class NewRoom extends Component {
    
        state = {
            ...this.props,
            userInfo: {
                country: '',
                display_name: '',
                email: '',
                id: '' ,
                images: ''   
            },
            playlists: [],
            devices: []
        };

    

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }
    _renderSubComp(){
        switch(this.state.render){
            case 'new': return <AppFunc/>
            default: return null;
        }
    }

    // Get the authenticated user
    getCurrentUser(){
        this.props.spotifyWebApi.getMe()
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

    getUserPlaylists(){
        this.props.spotifyWebApi.getUserPlaylists()
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
        this.props.spotifyWebApi.getMyDevices()
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

    MakeItem = function(X) {
        return <option>{X.name}</option>;
      };

    render() {
      return (
        <div>
            <h1>Room Hosted By: {this.state.userInfo.display_name}</h1>
            
            <button onClick={() => this.getCurrentUser()}>
                Get User
            </button>
            <ul>Choose Device:</ul>
                <select id="devices">{this.state.devices.map(this.MakeItem)}</select>
            <button onClick={() => this.getUserDevices()}>Get Devices</button> 

             <div>
            <ul>Choose Playlist:</ul>
                <select>{this.state.playlists.map(this.MakeItem)}</select>
            </div>

            <button onClick={() => this.getUserPlaylists()}>
            Get Playlists
            </button> 
            <button>
            Next
            </button> 
        </div>    
      );
    }
  }
  
export default NewRoom;