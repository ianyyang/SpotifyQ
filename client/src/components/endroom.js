import React, { Component } from 'react';
import Home from './home'

import '../App.css';

class EndRoom extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            oneLoadCheck: true,
            top_tempo: [],
            top_energy: [],
            top_dance: [],
            // stats: {
            //     seen: [],
            //     total_time: 0,
            //     num_songs: 0,
            //     tempo: [],
            //     energy: [],
            //     dance: [],
            // }
        }
    }

    // the below is to access the accumulated song statistics on each getNowPlaying() API call in HostRoom:
    // this.props.newroom.stats.id -> bpm, dance, duration, energy, valence
    // the above still contains duplicates due to multiple, fast API calls (despite a 1-off switch case in the if statement)
    //
    // getStats() is meant to go naively remove duplicates but also later on prune for track IDs with top statistics.
    // it should add the total_time listened as well as the num_songs listened to. it COULD be used somehow to devise
    // a way to determine the track IDs of the highest 3 values of the tempo, energy, dance statistics
    //
    // the ideal result would be statistics displaying total time listened (total_time), number of songs listened
    // (num_songs), the track IDs of the top 3 tempo, energy, dance values (top_tempo, top_energy, top_dance) - these
    // are to be displayed

    // not exactly sure how this isn't working... but it only gathers the statistics for the last track instead of
    // appending the i'th track - feel free to reference HostRoom's getAudioFeature() function, it uses a similar logic
    // for iterating and is clearly working...
    //
    // getStats() {
    //     if (this.state.oneLoadCheck) {
    //         for (var i = 0; i < this.props.newroom.stats.id.length; i++) {
    //             if (!this.state.stats.seen.includes(this.props.newroom.stats.id[i])) {
    //                 this.setState({
    //                     stats: {
    //                         seen: this.state.stats.seen.concat(this.props.newroom.stats.id[i]),
    //                         total_time: this.state.stats.total_time + this.props.newroom.stats.duration[i],
    //                         num_songs: this.state.stats.num_songs + 1,
    //                         tempo: this.state.stats.tempo.concat(this.props.newroom.stats.bpm[i]),
    //                         energy: this.state.stats.energy.concat(this.props.newroom.stats.energy[i]),
    //                         dance: this.state.stats.dance.concat(this.props.newroom.stats.dance[i])
    //                     }
    //                 })
    //             }
    //         }
    //         this.setState({oneLoadCheck: false})
    //     }
    // }

    end() {
        this.setState({render: 'restart'});
    }

    _renderSubComp() {
        switch(this.state.render){
            case 'restart': return <Home/>
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