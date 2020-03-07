import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { ScrollTo } from 'react-scroll-to';

import Home from './home'

import '../App.css';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class EndRoom extends Component {
    constructor() {
        super();
        this.state = {
            ...this.props,
            oneLoadCheck: true,
            date: new Date(),
            num_songs: 0,
            total_time: 0,
            top_bpm: [],
            top_energy: [],
            top_dance: [],
            top_valence: [],
            names: [],
            albums: [],
            artists: [],
            genres: [],
            art: [],
            unique_artists: 0,
            main_artist: '',
            render_top_three: 'tempo',
            render_favourites: 'track',
            top_artist_id: '',
            top_artist_art: '',
            top_album_art: ''
        }
    }

    getName(trackID) {
        this.props.home.home.spotifyWebApi.getTrack(trackID)
            .then((response) => {
                console.log('Fetched track information - for track name!', response);
                if (response) {
                    this.setState(prevState => ({
                        names: [...prevState.names, response.name]
                    }))
                }
            })
    }

    getAlbum(trackID) {
        this.props.home.home.spotifyWebApi.getTrack(trackID)
            .then((response) => {
                console.log('Fetched track information - for album information!', response);
                if (response) {
                    this.setState(prevState => ({
                        albums: [...prevState.albums, response.album.name]
                    }))
                }
            })
    }

    getArtistsAndGenre(trackID) {
        this.props.home.home.spotifyWebApi.getTrack(trackID)
            .then((response) => {
                console.log('Fetched track information - for artist information!', response);
                if (response) {
                    var artists_list = []
                    for (var i = 0; i < response.artists.length; i++) {
                        artists_list = [...artists_list, response.artists[i].name]
                        if (!this.state.artists.includes(response.artists[i].name)) {
                            this.setState({ unique_artists: this.state.unique_artists + 1 })
                        }
                    }

                    this.setState({
                        artists: this.state.artists.concat(artists_list),
                        main_artist: artists_list[0]
                    })
                }
            })

        // // get top genre of the main artist
        // this.props.home.home.spotifyWebApi.getArtist(this.state.main_artist)
        //     .then((response) => {
        //         console.log('Fetched artist information - for top genre!', response);
        //         if (response) {
        //             this.setState(prevState => ({
        //                 genres: [...prevState.genres, response.genres[0]]
        //             }))
        //         }
        //     })
    }

    getArt(trackID) {
        this.props.home.home.spotifyWebApi.getTrack(trackID)
            .then((response) => {
                console.log('Fetched track information - for track art!', response);
                if (response) {
                    this.setState(prevState => ({
                        art: [...prevState.art, response.album.images[0].url]
                    }))
                }
            })
    }

    getNameAlbumArtistGenreArt(trackID) {
        this.getName(trackID)
        this.getAlbum(trackID)
        this.getArtistsAndGenre(trackID)
        this.getArt(trackID)
    }

    indexOfMax(arr, seen) {
        var i = 0;
        var exit = false;

        // starting from index 0, set max at earliest non seen item
        while (exit === false) {
            var max = arr[i];
            var maxIndex = i;
            if (!seen.includes(maxIndex)) {
                exit = true;
            } else {
                i++;
            }
        }

        // iterate through arr to find max
        for (i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                // only set as new max if not seen before
                if (!seen.includes(i)) {
                    maxIndex = i;
                    max = arr[i];
                }
            }
        }

        return maxIndex;
    }

    getStats() {
        if (this.state.oneLoadCheck) {
            // compile album, artists, and album art
            this.props.newroom.stats.id.map((id) => (
                this.getNameAlbumArtistGenreArt(id)
            ))

            // compile song count and total duration
            this.props.newroom.stats.duration.map((duration) => (
                this.setState(prevState => ({
                    num_songs: prevState.num_songs + 1,
                    total_time: prevState.total_time + duration
                }))
            ))

            for (var i = 0; i < this.props.newroom.stats.id.length; i++) {
                // collect maxes
                this.setState(prevState => ({
                    top_bpm: [...prevState.top_bpm, this.indexOfMax(this.props.newroom.stats.bpm, prevState.top_bpm)],
                    top_energy: [...prevState.top_energy, this.indexOfMax(this.props.newroom.stats.energy, prevState.top_energy)],
                    top_dance: [...prevState.top_dance, this.indexOfMax(this.props.newroom.stats.dance, prevState.top_dance)],
                    top_valence: [...prevState.top_valence, this.indexOfMax(this.props.newroom.stats.valence, prevState.top_valence)]
                }));
            }

            // run once
            this.setState({ oneLoadCheck: false })
        }
    }

    getArtistID(trackID) {
        this.props.home.home.spotifyWebApi.getTrack(trackID)
            .then((response) => {
                console.log('Fetched track information - for track art!', response);
                if (response) {
                    this.setState({ top_artist_id: response.artists[0].id })
                }
            })
    }

    getArtistArt(artistID) {
        this.props.home.home.spotifyWebApi.getArtist(artistID)
            .then((response) => {
                console.log('Fetched track information - for track art!', response);
                if (response) {
                    this.setState({ top_artist_art: response.images[0].url })
                }
            })
    }

    getAlbumArt(trackID) {
        this.props.home.home.spotifyWebApi.getTrack(trackID)
            .then((response) => {
                console.log('Fetched track information - for track art!', response);
                if (response) {
                    this.setState({ top_album_art: response.album.images[0].url })
                }
            })
    }

    mode(array) {
        if (array.length === 0)
            return null;
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for (var i = 0; i < array.length; i++) {
            var el = array[i];
            if (modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;
            if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }

    end() {
        this.setState({
            render: 'restart',
            date: new Date()
        });
    }

    changeFavouritesRender(category) {
        this.getArtistID(this.props.newroom.stats.id[this.state.albums.indexOf(this.mode(this.state.albums))])
        this.getArtistArt(this.state.top_artist_id)
        this.getAlbumArt(this.props.newroom.stats.id[this.state.albums.indexOf(this.mode(this.state.albums))])
        this.setState({ render_favourites: category })
    }

    changeTopThreeRender(category) {
        this.setState({ render_top_three: category })
    }

    _renderFavourites() {
        switch (this.state.render_favourites) {
            default: return (
                <div>
                    <img className='endroom-image' src={this.state.art[this.props.newroom.stats.id.indexOf(this.mode(this.props.newroom.stats.id))]} alt="" />
                </div>
            )
            case 'artist': return (
                <div>
                    <img className='endroom-image' src={this.state.top_artist_art} alt="" />
                </div>
            )
            case 'album': return (
                <div>
                    <img className='endroom-image' src={this.state.top_album_art} alt="" />
                </div>
            )
        }
    }

    _renderTopThree() {
        switch (this.state.render_top_three) {
            default: return (
                <div>
                    <Grid container spacing={6} justify="center">
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_bpm[0]]} alt="" />
                        </Grid>
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_bpm[1]]} alt="" />
                        </Grid>
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_bpm[2]]} alt="" />
                        </Grid>
                    </Grid>
                </div>
            )
            case 'energy': return (
                <div>
                    <Grid container spacing={6} justify="center">
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_energy[0]]} alt="" />
                        </Grid>
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_energy[1]]} alt="" />
                        </Grid>
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_energy[2]]} alt="" />
                        </Grid>
                    </Grid>
                </div>
            )
            case 'dance': return (
                <div>
                    <Grid container spacing={6} justify="center">
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_dance[0]]} alt="" />
                        </Grid>
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_dance[1]]} alt="" />
                        </Grid>
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_dance[2]]} alt="" />
                        </Grid>
                    </Grid>
                </div>
            )
            case 'valence': return (
                <div>
                    <Grid container spacing={6} justify="center">
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_valence[0]]} alt="" />
                        </Grid>
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_valence[1]]} alt="" />
                        </Grid>
                        <Grid item xs={2}>
                            <img className='endroom-image' src={this.state.art[this.state.top_valence[2]]} alt="" />
                        </Grid>
                    </Grid>
                </div>
            )
        }
    }

    _renderSubComp() {
        const { classes } = this.props;
        switch (this.state.render) {
            case 'restart': return <Home />
            default: return (
                <div className={classes.root}>
                    <div className='endroom-header'>
                        <h1>Your Session At A Glance</h1>
                    </div>
                    <h3>
                        Start: {this.props.newroom.date.toString()}
                        <br></br>
                        End: {this.state.date.toString()}
                    </h3>

                    <div className='endroom-subheader'>
                        <h2>That's A Total Of</h2>
                    </div>
                    <h3>
                        {Math.floor((this.state.date.getTime() - this.props.newroom.date.getTime()) / 1000 / 60 / 60)} hours {Math.floor((this.state.date.getTime() - this.props.newroom.date.getTime()) / 1000 / 60) % 60} minutes {Math.floor((this.state.date.getTime() - this.props.newroom.date.getTime()) / 1000) % 60} seconds
                            </h3>

                    <div className='endroom-subheader'>
                        <h2>You Listened To</h2>
                    </div>
                    <h3>
                        {this.state.num_songs} songs from {this.state.albums.length} albums by {this.state.unique_artists} artists
                            </h3>

                    <div className='endroom-subheader'>
                        <h2>Here Were Your Favourites</h2>
                    </div>
                    <div>
                        <Grid container spacing={0} justify="center">
                            <Grid item xs={1} justify="center">
                                <Button onClick={() => this.changeFavouritesRender('track')}>Track</Button>
                            </Grid>
                            <Grid item xs={1} justify="center">
                                <Button onClick={() => this.changeFavouritesRender('artist')}>Artist</Button>
                            </Grid>
                            <Grid item xs={1} justify="center">
                                <Button onClick={() => this.changeFavouritesRender('album')}>Album</Button>
                            </Grid>
                        </Grid>
                    </div>

                    <div>
                        {this._renderFavourites()}
                    </div>

                    <div className='endroom-header'>
                        <h1>Your Music Tastes Under The Scope</h1>
                    </div>
                    <div>
                        <Grid container spacing={0} justify="center">
                            <Grid item xs={1} justify="center">
                                <Button onClick={() => this.changeTopThreeRender('tempo')}>Tempo</Button>
                            </Grid>
                            <Grid item xs={1} justify="center">
                                <Button onClick={() => this.changeTopThreeRender('energy')}>Energy</Button>
                            </Grid>
                            <Grid item xs={1} justify="center">
                                <Button onClick={() => this.changeTopThreeRender('dance')}>Danceability</Button>
                            </Grid>
                            <Grid item xs={1} justify="center">
                                <Button onClick={() => this.changeTopThreeRender('valence')}>Valence</Button>
                            </Grid>
                        </Grid>
                    </div>

                    <div>
                        {this._renderTopThree()}
                    </div>

                    <div>
                        <button className="button_a" onClick={() => this.end()}>New Room</button>
                    </div>
                </div>
            );
        }
    }

    // ===== "Your Session At A Glance"
    // when you started your session: "this.props.newroom.date"
    // when you ended your session: "this.state.date"
    // length of session: "this.state.date.getTime() - this.props.newroom.date.getTime()" (in milliseconds)
    // total length of all songs: "this.state.total_time" (in milliseconds)
    // ----- "You Listened To"
    // number of songs: "this.state.num_songs"
    // number of albums: "this.state.albums.length"
    // number of artists: "this.state.artists.length"
    // number of genres: "this.state.genres.length"
    // ----- "Here Were Some Of Your Favourites"
    // most common song: "this.state.names"
    // most common album: this.state.albums"
    // most common artist: "this.state.artists"
    // most common genre: "this.state.genres"

    // ===== "Your Music Tastes Under The Scope"
    // top 3 bpm: "this.state.top_bpm" (Your average beats per minute is X)
    // top 3 energy: "this.state.top_energy" (X% of your tracks are energetic)
    // top 3 dance: "this.state.top_dance" (X% of your tracks are danceable)
    // top 3 valence: "this.state.top_valence" (X% of your tracks are high/low valence)
    // ----- 
    // graph: every song's length (in s), bpm, energy (*100), dance (*100), valence(*100)

    render() {
        return (
            <div className="EndRoom">
                {this._renderSubComp()}
                {this.getStats()}
            </div>
        );
    }
}

EndRoom.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EndRoom);