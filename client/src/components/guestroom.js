import React, { Component } from 'react';

class GuestRoom extends Component {
    constructor() {
        super();
        this.state = {
            ...this.props,
            nowPlaying: {
                name: '',
                image: '',
            },
            roomTracks: []
        }
    }

    getNowPlaying() {
        this.props.props1.spotifyWebApi.getMyCurrentPlaybackState()
            .then((response) => {
                console.log('Now playing successfully captured!', response);

                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        image: response.item.album.images[0].url
                    }
                })
            }, function (err) {
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

    test() {
        console.log(this.props);
    }

    handleClick(compName, e) {
        console.log(compName);
        this.setState({ render: compName });
    }
    _renderSubComp() {
        switch (this.state.render) {
            case 'new': return <div>this is the guest room</div>
            default: return (
                <div>
                    <h1>{this.props.props1.userInfo.display_name}'s Room</h1>
                    <label>Access Code: 1234</label> <br />
                    <label>Selected Playlist: {this.props.selectedPlaylist}</label> <br />
                    <label>Selected Device: {this.props.selectedDevice}</label>

                    <div> Now Playing: {this.state.nowPlaying.name}</div><div>
                        <img src={this.state.nowPlaying.image} style={{ width: 100 }} />
                    </div>
                    <button onClick={() => this.getNowPlaying()}>
                        Check Now Playing
            </button>

                    <div>
                        <h2>Room Queue:<br /></h2>

                        <ul id="list_1">{
                            this.props.roomTracks.length === 0 ? "Its empty... Add some tracks!"
                                : this.props.roomTracks.map(this.MakeItem)}
                        </ul>

                        <button id="right" onClick={() => this.test()}>
                            Add
                </button>
                        <button>
                            Play/Pause
                </button>
                        <button>
                            End Room
                </button>
                    </div>
                </div>
            );
        }
    }

    MakeItem = function (X, i) {
        return <li key={i}>{X.name}</li>;
    };

    render() {
        return (
            <div className="GuestRoom">
                {this._renderSubComp()}
            </div>
        );
    }
}
export default GuestRoom;