import React, { Component } from 'react';

import HostRoom from './hostroom'


class NewRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
            newPlaylist: "New Playlist",
            playlists:[], 
            selectedPlaylist:'',
            selectedDevice: ''
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
        //window.location.reload();
    }
    
    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }

    handleChange(event) {
        this.setState({newPlaylist: event.target.value});
      }
      
    handlePlaylistChange = (event) => {
        /*alert("test");
        var index = event.nativeEvent.target.selectedIndex;
        if (this.state.newFlag){
            this.setState({selectedPlaylist: this.state.playlists[index]});
        }else{
            this.setState({selectedPlaylist: this.props.playlists[index]});
        }*/

    }

    /*validateAndNext() {
        var d_index = document.getElementById('devices').selectedIndex;
        var p_index = document.getElementById('playlists').selectedIndex;

        this.setState({selectedDevice: this.props.devices[d_index]});

        if (this.state.newFlag){
            this.setState({selectedPlaylist: this.state.playlists[p_index]});
        }else{
            this.setState({selectedPlaylist: this.props.playlists[p_index]});
        }

        this.handleClick.bind(this, 'next')
      }*/

    _renderSubComp(){
        switch(this.state.render){
            case 'next': return <HostRoom {...this.props}/>

            default: return (
            <div>
                <h1>New Room Hosted By: {this.props.userInfo.display_name}</h1>
                <label>Choose Device: <br/>
                <select id="devices">{this.props.devices.map(this.MakeItem)}</select>
                </label>

                <div>
                    <label>
                    <br/> Create New Playlist: <br/>
                    <input type="text" value={this.state.newPlaylist} onChange={this.handleChange.bind(this)} />
                    </label>
                    <input onClick={() => this.postAndGet()} type="submit" value="Submit" /> 
                </div>

                <div>
                <label>Choose Room Playlist:<br/>
                    <select id="playlists">{this.props.playlists.map(this.MakeItem)}} onChange={this.handlePlaylistChange.bind(this)}</select>
                </label>
                </div>
                
                <button onClick={this.handleClick.bind(this, 'next')}>Next</button> 


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