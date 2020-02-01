import React, { Component } from 'react';
import Home from './home'

import '../App.css';

class EndRoom extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props
        }
    }

    end() {
        this.setState({render:'restart'});
    }

    _renderSubComp(){
        switch(this.state.render){
            case 'restart': return <Home/>
            default: return ( 
            <div>   
                <h1>{this.props.home.home.userInfo.display_name.toUpperCase()}'s ROOM</h1>
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
        </div>      
      );
    }
  }
  
  
export default EndRoom;