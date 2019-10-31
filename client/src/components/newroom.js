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
            roomTracks: []
        };
      }
   
       
    postNewPlaylist(){
        this.props.spotifyWebApi.createPlaylist(this.props.userInfo.id, {'name': this.state.newPlaylist})
        .then((response) => {
            //alert('New playlist created: ', response.name);
            this.props.playlists.push({
                name: response.name,
                id: response.id
              });
        }, function(err) {
            console.error('Something went wrong!', err);
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
 
    postAndGet(){
        this.postNewPlaylist();
        //this.getUserPlaylists();
        window.location.reload();
    }

    getPlaylistTracks(){
        var id = '';
        var playlist;

        for (playlist of this.props.playlists){
            if (playlist.name === this.state.selectedPlaylist){
              this.setState({selectedPlaylistID: id});
              id = playlist.id;
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

        if (compName === 'next'){
            if (this.state.selectedDevice === ''){
                this.setState({selectedDevice: this.props.devices[0].name});
            }
            if (this.state.selectedPlaylist === ''){
                this.setState({selectedPlaylist: this.props.playlists[0].name});
            }

            this.getPlaylistTracks();
        }
        
        this.setState({render:compName});        
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
            case 'next': return <HostRoom props1={this.props} selectedPlaylistID={this.state.selectedPlaylistID} selectedDevice={this.state.selectedDevice} 
            selectedPlaylist={this.state.selectedPlaylist} roomTracks={this.state.roomTracks}/>
 
            default: return (
            <div>
                <h1>New Room Hosted By: {this.props.userInfo.display_name}</h1>
                <label>Choose Device: <br/>
                <select id="devices" onChange={this.handleDeviceChange.bind(this)}>{this.props.devices.map(this.MakeItem)}</select>
                </label>
 
                <div>
                    <label>
                    <br/> Create New Playlist: <br/>
                    <input type="text" value={this.state.newPlaylist} onClick={this.handlePlaylistTextChange.bind(this)} onChange={this.handlePlaylistTextChange.bind(this)} />
                    </label>
                    <input onClick={() => this.postAndGet()} type="submit" value="Submit" />
                </div>
 
                <div>
                <label>Choose Room Playlist:<br/>
                    <select id="playlists" onChange={this.handlePlaylistListChange.bind(this)}>{this.props.playlists.map(this.MakeItem)}</select>
                </label>
                </div>
               
                <button onClick={() => this.handleClick('next', this)}>Next</button>
 
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