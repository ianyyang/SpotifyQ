import React, { Component } from 'react';
import Home from './home'

import '../App.css';

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
            top_valence: []
        }
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
            // compile song count and total duration
            this.props.newroom.stats.duration.map((duration) => (
                this.setState(prevState => ({
                    num_songs: prevState.num_songs + 1,
                    total_time: prevState.total_time + duration
                }))
            ))

            for (var i = 0; i < this.props.newroom.stats.bpm.length; i++) {
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

    end() {
        this.setState({
            render: 'restart',
            date: new Date()
        });
    }

    _renderSubComp() {
        switch (this.state.render) {
            case 'restart': return <Home />
            default: return (
                <div>
                    <h1>{this.props.home.home.userInfo.display_name.toUpperCase()}'s ROOM</h1>

                    <div>
                        {this.props.newroom.history}
                    </div>

                    <button className="button_a" onClick={() => this.end()}>
                        New Room
                </button>
                </div>
            );
        }
    }

    // --- "Your Session At A Glance"
    // when you started your session: "this.props.newroom.date"
    // when you ended your session: "this.state.date"
    // length of session: "this.state.date.getTime() - this.props.newroom.date.getTime()" (in milliseconds)
    
    // number of songs played: "this.state.num_songs"
    // total length of all songs: "this.state.total_time" (in milliseconds)

    // most common song: ???
    // most common artist: "this.props.newroom.stats.artists"
    // most common genre: ???
    // *** CHOOSE ABOVE OR BELOW
    // genre breakdown: ???


    // --- "Music Tastes Under The Scope"
    // *** POSSIBLE OPTION: instead of top 3, do paginations of 3
    // top 3 bpm: this.state.top_bpm
    // top 3 energy: this.state.top_energy
    // top 3 dance: this.state.top_dance
    // top 3 valence: this.state.top_valence

    // *** USE VICTORY LIBRARY (?)
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


export default EndRoom;