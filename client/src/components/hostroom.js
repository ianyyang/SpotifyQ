import React, { Component } from 'react';

class HostRoom extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            nowPlaying: { 
                name: '', 
                image: '',
            },
            roomTracks: []
        }
        /*if (this.state.loggedIn){
            this.getPlaylistTracks()
        }*/
    }

    getPlaylistTracks(){
        this.props.spotifyWebApi.getPlaylistTracks('thelinmichael', '3ktAYNcRHpazJ9qecm3ptn', {
            offset: 1,
            limit: 5,
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

    getNowPlaying(){
        this.props.spotifyWebApi.getMyCurrentPlaybackState()
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

      /*resumePlayback(){
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
      }*/

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }
    _renderSubComp(){
        switch(this.state.render){
            case 'new': return <div>this is the host room</div>
            default: return ( 
            <div>   
                <h1>{this.props.userInfo.display_name}'s Room</h1>
                <label>Access Code: 1234</label> 
                <div> Now Playing: {this.state.nowPlaying.name}</div><div>
                    <img src={this.state.nowPlaying.image } style={{width:100}}/>
                </div>
                <button onClick={() => this.getNowPlaying()}>
                    Check Now Playing
                </button>

                <div>
                    <label>Room Tracks:<br/>
                        {this.state.roomTracks.map(this.MakeItem)}
                    </label>
                    <button onClick={() => this.getPlaylistTracks()}>
                        Get Room Tracks
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