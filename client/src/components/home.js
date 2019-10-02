import React, { Component } from 'react';

// Components
import JoinRoom from './joinroom'
import AppFunc from '../App-function'

class Home extends Component {
    constructor(){
        super();
        const params = this.getHashParams();
        this.state ={
            render:'',
            loggedIn: params.access_token ? true : false,
        }

        if (this.state.loggedIn){
            this.state.render = 'new'}
    }

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
    */
    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
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