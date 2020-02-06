import React, { Component } from 'react';
import Home from './home'

import '../App.css';

class EndRoom extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            oneLoadCheck: true,
            num_songs: 0,
            total_time: 0,
            top_bpm: [],
            top_energy: [],
            top_dance: []
        }
    }

    sortByStat() {
        this.props.newroom.stats.bpm
            .sort((a, b) => a - b)
            .map((item, index) => 
                [item, index]
            );
        console.log(this.props.newroom.stats.bpm);
    }

    getStats() {
        if (this.state.oneLoadCheck) {
            // this.sortByStat();
            this.props.newroom.stats.duration.map((duration) => (
                this.setState(prevState => ({
                    num_songs: prevState.num_songs + 1,
                    total_time: prevState.total_time + duration
                }))
            ))
            this.setState({oneLoadCheck: false});
        }
    }

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