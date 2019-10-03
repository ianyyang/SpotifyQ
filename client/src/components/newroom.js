import React, { Component } from 'react';

import AppFunc from '../App-function'


class NewRoom extends Component {
    
        state = {
            ...this.props
        };

    

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }
    _renderSubComp(){
        switch(this.state.render){
            case 'next': return <AppFunc/>
            default: return (
            <div>
                <h1>Room Hosted By: {this.props.userInfo.display_name}</h1>
                <ul>Choose Device:</ul>
                <select id="devices">{this.props.devices.map(this.MakeItem)}</select>

                <div>
                <ul>Choose Playlist:</ul>
                    <select>{this.props.playlists.map(this.MakeItem)}</select>
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