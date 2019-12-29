import React, { Component } from 'react';
 
import HostRoom from './hostroom'
 
class NewRoom extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            ...this.props,
            newPlaylist:'New Playlist',
            selectedPlaylist: '',
            selectedPlaylistID: '',
            selectedDevice: '',
            selectedDeviceID: '',
            roomTracks: [],
            newPlaylistCheck: false,
            render: 'roomPlaylist'
        }
      }
       
    postNewPlaylist(){

        this.props.spotifyWebApi.createPlaylist(this.props.userInfo.id, {'name': this.state.newPlaylist})
        .then((response) => {
            //alert('New playlist created: ', response.name);
            this.props.playlists.push({
                name: response.name,
                id: response.id
              });

              this.setState({selectedPlaylist: response.name});
              this.setState({selectedPlaylistID: response.id});

        }, function(err) {
            console.error('Something went wrong!', err);
        })

        // Need to make it follow through to the next window using the newly created playlist       
        this.handleClick('next', this)
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

    getPlaylistTracks(id){
        var playlists = this.props.playlists;

        for (var i = 0; i < playlists.length; i++){
            if (playlists[i].name === this.state.selectedPlaylist){
                id = playlists[i].id;
                this.setState({selectedPlaylistID: id});
            }
        }
        
        this.props.spotifyWebApi.getPlaylistTracks(this.props.userInfo.id ,id, {
            offset: 0,
            limit: 20,
            fields: 'items'
          })
          .then((response)  => {
              console.log('The playlist contains these tracks', response);

              var json = response.items;
              var arr = [];

              Object.keys(json).forEach(function(key) {
                arr.push({
                    name: json[key].track.name,
                    id: json[key].track.id
                  })
              });

              this.setState({
                roomTracks: arr
              })
            },
            function(err) {
              console.log('Something went wrong!', err);
            }
          );
    }
   
    handleClick(compName, e){
        if (compName === 'roomPlaylist'){
            this.setState({newPlaylistCheck: true});
        }

        if (this.props.devices.length == 0) {
            this.setState({render: 'emptyDevices'})
        } else {
            var playlist_id;
            if (compName === 'next'){
                
                // Handle validation for first value selections of dropdowns.
                if (this.state.selectedDevice === ''){
                    this.setState({selectedDevice: this.props.devices[0].name});
                    this.setState({selectedDeviceID: this.props.devices[0].id});
                }
                if (this.state.selectedPlaylist === '' || this.state.newPlaylistCheck === true){
                    this.setState({selectedPlaylist: this.props.playlists[0].name});
                    this.setState({selectedPlaylistID: this.props.playlists[0].id});
                    playlist_id = this.props.playlists[0].id;
                }

                // Get Device ID
                var device = '';
                var d_id = '';

                for (device of this.props.devices){
                    if (device.name === this.state.selectedDevice){
                        d_id = device.id;
                        this.setState({selectedDeviceID: d_id});
                    }
                }

                // Get room tracks, selected playlist name, id
                this.getPlaylistTracks(playlist_id);
            }
            
            this.setState({render:compName});
        }
    }
 
    handleDeviceChange(event) {
        this.setState({selectedDevice: event.target.value});
    }
 
    handlePlaylistTextChange(event) {
        this.setState({newPlaylist: event.target.value});
        this.setState({selectedPlaylist: event.target.value});
      }
     
    handlePlaylistListChange(event) {
        this.setState({selectedPlaylist: event.target.value});
    }
 
    _renderSubComp(){
        switch(this.state.render){
            case 'next': return <HostRoom home={this.props} newroom={this.state}/>
            case 'emptyDevices': return (
                <div>
                    <label>
                        It looks like you have no Spotify applications open on any devices.<br/>
                        Would you like to open the Spotify web app <a href = "spotify:">here?</a><br/>
                        Or open the Spotify web player <a href = "https://open.spotify.com/" target="_blank">here?</a><br/>
                    </label>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
            )
            case 'roomPlaylist': return (
                <div>
                    <h1>New Room Hosted By: {this.props.userInfo.display_name}</h1>
                    <label>Choose Device: <br/>
                        <select id="devices" onChange={this.handleDeviceChange.bind(this)}>{this.props.devices.map(this.MakeItem)}</select>
                    </label>
    
                    <div>
                        <label>Choose Room Playlist:<br/>
                            <select id="playlists" onChange={this.handlePlaylistListChange.bind(this)}>{this.props.playlists.map(this.MakeItem)}</select>
                        </label>
                        <button onClick={() => this.handleClick('next', this)}>Next</button>
                    </div>
                    <button onClick={() => this.handleClick('newPlaylist', this)}>Make a new playlist instead?</button>
                </div>
            )
            case 'newPlaylist': return (
                <div>
                    <h1>New Room Hosted By: {this.props.userInfo.display_name}</h1>
                    <label>Choose Device: <br/>
                        <select id="devices" onChange={this.handleDeviceChange.bind(this)}>{this.props.devices.map(this.MakeItem)}</select>
                    </label>
    
                    <div>
                        <label> Create New Playlist: <br/>
                            <input type="text" value={this.state.newPlaylist} onClick={this.handlePlaylistTextChange.bind(this)} onChange={this.handlePlaylistTextChange.bind(this)} />
                        </label>
                        <button onClick={() => this.postNewPlaylist()}>Submit</button>
                    </div>
                    <button onClick={() => this.handleClick('roomPlaylist', this)}>Use an existing playlist instead?</button>
                </div>
            )
            default: return (
                <div>
                    <h1>New Room Hosted By: {this.props.userInfo.display_name}</h1>
                    <label>Choose Device: <br/>
                        <select id="devices" onChange={this.handleDeviceChange.bind(this)}>{this.props.devices.map(this.MakeItem)}</select>
                    </label>
                </div>
            );
        }
    }
 
    MakeItem = function(X, i) {
        return <option key={i}>{X.name}</option>;
      };
 
    render() {
      return (
        <div>  
            {this._renderSubComp()}
        </div>    
      );
    }
  }
 
export default NewRoom;