import React, { Component } from 'react'
import EditRoom from './editroom'
import EndRoom from './endroom'

import '../App.css';

class HostRoom extends Component {
    constructor() {
        super();
        this.state = {
            ...this.props,
            nowPlaying: {
                name: '',
                artists: '',
                image: '',
            },
            roomTracks: [],
            playing: 0,
            oneLoadCheck: true,
            stats: {
                id: [],
                duration: [],
                bpm: [],
                dance: [],
                energy: [],
                valence: [],
            }
        }
    }

    getAudioFeature(trackID) {
        this.props.home.spotifyWebApi.getAudioFeaturesForTrack(trackID)
            .then((response) => {
                console.log('Fetched audio features!', response);
                if (response) {
                    this.setState({
                        stats: {
                            id: this.state.stats.id.concat(response.id),
                            duration: this.state.stats.duration.concat(response.duration_ms),
                            bpm: this.state.stats.bpm.concat(response.tempo),
                            dance: this.state.stats.dance.concat(response.danceability),
                            energy: this.state.stats.energy.concat(response.energy),
                            valence: this.state.stats.valence.concat(response.valence)
                        }
                    })
                }
            }, function (err) {
                console.error('Something went wrong!', err);
            });
    }

    getNowPlaying() {
        this.props.home.spotifyWebApi.getMyCurrentPlaybackState()
            .then((response) => {
                console.log('Now playing successfully captured!', response);

                var artists = '';
                if (response) {

                    for (var i = 0; i < response.item.artists.length; i++) {
                        artists += response.item.artists[i].name + ", ";
                    }

                    this.setState({
                        nowPlaying: {
                            name: response.item.name,
                            artists: artists.slice(0, -2),
                            image: response.item.album.images[0].url
                        }
                    })

                    if (!this.state.stats.id.includes(response.item.id)) {
                        this.getAudioFeature(response.item.id)
                    }
                }

            }, function (err) {
                console.error('Something went wrong!', err);
            });
    }

    throttleGetNowPlaying() {
        setTimeout(() => {this.getNowPlaying()}, 1000);
    }

    resumePlayback() {
        this.props.home.spotifyWebApi.play({ device_id: this.props.newroom.selectedDeviceID })
            .then(function (data) {
                console.log('Playback resumed!', data);
            }, function (err) {
                console.error('Something went wrong!', err);
            })
    }

    pausePlayback() {
        this.props.home.spotifyWebApi.pause({ device_id: this.props.newroom.selectedDeviceID })
            .then(function (data) {
                console.log('Playback paused!');
            }, function (err) {
                console.error('Something went wrong!', err);
            });
    }

    resumePausePlayback() {
        if (this.state.playing == 0) {
            this.resumePlayback()
            this.setState({ playing: 1 })
        } else {
            this.pausePlayback()
            this.setState({ playing: 0 })
        }
    }

    end() {
        this.setState({ render: 'end' });
    }

    edit() {
        this.setState({ render: 'edit' });
    }

    oneLoad() {
        if (this.state.oneLoadCheck) {
            this.getNowPlaying();
            this.setState({ oneLoadCheck: false })
        }
    }

    handleClick(compName, e) {
        console.log(compName);
        this.setState({ render: compName });
    }

    _renderSubComp() {
        switch (this.state.render) {
            case 'edit': return <EditRoom {...this.props} />
            case 'end': return <EndRoom home={this.props} newroom={this.state} />
            default: return (
                <div>
                    <h1>{this.props.home.userInfo.display_name.toUpperCase()}'s ROOM</h1>
                    <label>Playlist: {this.props.newroom.selectedPlaylist}</label> <br />
                    <label>Device: {this.props.newroom.selectedDevice}</label>

                    <div>
                        <img src={this.state.nowPlaying.image} style={{ width: 100 }} />
                    </div>
                    <div> {this.state.nowPlaying.name + " - " + this.state.nowPlaying.artists}</div>

                    <button className="button_a" onClick={() => this.getNowPlaying()}>
                        Check Now Playing
                </button>

                    <div>
                        <h2>Room Queue:<br /></h2>
                        <ul className="react-list-select">{
                            this.props.newroom.roomTracks.length === 0 ? "Its empty... Add some tracks!"
                                : this.props.newroom.roomTracks.map(this.MakeItem)}
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

    MakeItem = function (X, i) {
        return <li key={i}>{X.name + " - " + X.artists}</li>;
    };

    render() {
        return (
            <div className="HostRoom">
                {this._renderSubComp()}
                {this.oneLoad()}
                {this.throttleGetNowPlaying()}
            </div>
        );
    }
}

export default HostRoom;