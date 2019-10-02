import React, { Component } from 'react';

// Components
import NewRoom from './newroom'
import JoinRoom from './joinroom'
import AppFunc from '../App-function'

class Home extends Component {
    constructor(){
        super();
        this.state = {render:''}
    }

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }
    _renderSubComp(){
        switch(this.state.render){
            case 'login': return (<a href = "http://localhost:8888">
            <button>Login with Spotify</button> </a>)
            case 'new': return <AppFunc/>              
            case 'join': return <JoinRoom/>
            default: return(
                <div className="Home">        
                    <button onClick={this.handleClick.bind(this, 'login')}>New Room</button>
                    <button onClick={this.handleClick.bind(this, 'join')}>Join Room</button>
                </div>
          );
        }
    }

    render() {
      return (
        <div className="Home">          
            {this._renderSubComp()}
        </div>
      );
    }
  }
  
export default Home;