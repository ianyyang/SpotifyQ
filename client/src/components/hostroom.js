import React, { Component } from 'react';
import Search from './search'
import Home from './home'

import '../App.css';

class HostRoom extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            nowPlaying: { 
                name: '', 
                image: '',
            },
            roomTracks: [],
            playing: 0
        }
    }

    getNowPlaying(){
        this.props.home.spotifyWebApi.getMyCurrentPlaybackState()
        .then((response) => {
          console.log('Now playing successfully captured!', response);
    
          this.setState({
            nowPlaying: {
              name: response.item.name,
              image: response.item.album.images[0].url
            }
          })
        }, function(err) {
          console.error('Something went wrong!', err);
        });
      }

    // resumePlayback() and pausePlayback() currently not working
    // index = takes in the index of the current device, to be used to determine current device ID from this.state.devices[index].id
    // document.getElementById('devices') returning null, so cannot collect the .selectedIndex
    resumePlayback(){
        var index = document.getElementById('devices').selectedIndex;
        this.props.home.spotifyWebApi.play({device: this.state.devices[index].id})
        .then(function(data) {
            console.log('Playback resumed!', data);
        }, function(err) {
            console.error('Something went wrong!', err);
        })
    }

    pausePlayback() {
        var index = document.getElementById('devices').selectedIndex;
        this.props.home.spotifyWebApi.pause({device: this.state.devices[index].id})
        .then(function(data) {
            console.log('Playback paused!');
        }, function(err) {
            console.error('Something went wrong!', err);
        });
    }

    resumePausePlayback() {
        if (this.state.playing == 0) {
            this.resumePlayback()
        } else {
            this.pausePlayback()
        }
    }

    search(){
        this.setState({render:'search'});
    }
    end(){
        this.setState({render:'end'});
    }

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }

    _renderSubComp(){
        switch(this.state.render){
            case 'search': return <Search {...this.props}/>
            case 'end': return <Home/>
            default: return ( 
            <div>   
                <h1>{this.props.home.userInfo.display_name}'s Room</h1>
                <label>Access Code: 1234</label> <br/>
                <label>Selected Playlist: {this.props.newroom.selectedPlaylist}</label> <br/>
                <label>Selected Device: {this.props.newroom.selectedDevice}</label> 

                <div> Now Playing: {this.state.nowPlaying.name}</div><div>
                    <img src={this.state.nowPlaying.image } style={{width:100}}/>
                </div>
                <button onClick={() => this.getNowPlaying()}>
                    Check Now Playing
                </button>

                <div>
                    <h2>Room Queue:<br/></h2>
                        
                        <ul className="list_1">{
                            this.props.newroom.roomTracks.length === 0 ? "Its empty... Add some tracks!"
                            :this.props.newroom.roomTracks.map(this.MakeItem)}
                        </ul>
                    
                    <button id="right" onClick={() => this.search()}>
                        Add
                    </button>
                    <button onClick={() => this.resumePausePlayback()}>
                        Play/Pause
                    </button>
                    <button onClick={() => this.end()}>
                        End Room
                    </button>
                </div>
            </div>
            );
        }
    }

    MakeItem = function(X, i) {
        return <li key={i}>{X.name}</li>;
      };

    render() {
      return (
        <div className="HostRoom">        
          {this._renderSubComp()}
        </div>      
      );
    }
  }
  
  
export default HostRoom;