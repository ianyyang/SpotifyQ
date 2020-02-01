import React, { Component } from 'react';
import EditRoom from './editroom'
import EndRoom from './endroom'

import '../App.css';

class HostRoom extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            history: [],
            nowPlaying: { 
                name: '', 
                artists: '',
                image: '',
            },
            roomTracks: [],
            playing: 0,
            oneLoadCheck: true
        }
    }

    getNowPlaying() {
        this.props.home.spotifyWebApi.getMyCurrentPlaybackState()
        .then((response) => {
          console.log('Now playing successfully captured!', response);

          var artists = '';
          if (response) {
            
            for (var i = 0; i < response.item.artists.length; i++){
                artists += response.item.artists[i].name + ", ";
            }

            this.setState({
                nowPlaying: {
                  name: response.item.name,
                  artists: artists.slice(0, -2),
                  image: response.item.album.images[0].url
                }
            })

            if (!this.state.history.includes(response.item.id)) {
                this.setState({
                    history: this.state.history.concat(response.item.id)
                })
            }
          }
          
        }, function(err) {
          console.error('Something went wrong!', err);
        });
    }

    resumePlayback() {
        this.props.home.spotifyWebApi.play({device_id: this.props.newroom.selectedDeviceID})
        .then(function(data) {
            console.log('Playback resumed!', data);
        }, function(err) {
            console.error('Something went wrong!', err);
        })
    }

    pausePlayback() {
        this.props.home.spotifyWebApi.pause({device_id: this.props.newroom.selectedDeviceID})
        .then(function(data) {
            console.log('Playback paused!');
        }, function(err) {
            console.error('Something went wrong!', err);
        });
    }

    resumePausePlayback() {
        if (this.state.playing == 0) {
            this.resumePlayback()
            this.setState({playing: 1})
        } else {
            this.pausePlayback()
            this.setState({playing: 0})
        }
    }

    end(){
        this.setState({render:'end'});
    }

    edit(){
        this.setState({render:'edit'});
    }

    oneLoad(){
        if (this.state.oneLoadCheck){
            this.getNowPlaying();
            this.setState({oneLoadCheck: false})
        }
    }

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }

    _renderSubComp(){
        switch(this.state.render){
            case 'edit': return <EditRoom {...this.props}/>
            case 'end': return <EndRoom home={this.props} newroom={this.state}/>
            default: return ( 
            <div>   
                <h1>{this.props.home.userInfo.display_name.toUpperCase()}'s ROOM</h1>
                <label>Playlist: {this.props.newroom.selectedPlaylist}</label> <br/>
                <label>Device: {this.props.newroom.selectedDevice}</label> 

                <div>
                    <img src={this.state.nowPlaying.image } style={{width:100}}/>
                </div>
                <div> {this.state.nowPlaying.name + " - " + this.state.nowPlaying.artists}</div>

                <button className="button_a" onClick={() => this.getNowPlaying()}>
                        Check Now Playing
                </button>

                <div>
                    <h2>Room Queue:<br/></h2>
                        <ul className="react-list-select">{
                            this.props.newroom.roomTracks.length === 0 ? "Its empty... Add some tracks!"
                            :this.props.newroom.roomTracks.map(this.MakeItem)}
                        </ul>
                    
                    <button className="button_a" onClick={() => this.edit()}>
                        Edit Room
                    </button>
                    <button className="button_a" onClick={() => this.resumePausePlayback()}>
                        Play/Pause
                    </button>
                    <button className="button_a" onClick={() => this.end()}>
                        End Room
                    </button>
                </div>
            </div>
            );
        }
    }

    MakeItem = function(X, i) {
        return <li key={i}>{X.name + " - " + X.artists}</li>;
      };

    render() {
      return (
        <div className="HostRoom">        
          {this._renderSubComp()}
          {this.getNowPlaying()}
          {this.oneLoad()}
        </div>      
      );
    }
  }
  
  
export default HostRoom;