import React, { Component } from 'react';

// Components
import JoinRoom from './joinroom'
import AppFunc from '../App-function'
import NewRoom from './newroom'
import Spotify from 'spotify-web-api-js';


class Home extends Component {
    constructor(){
        super();
        const params = this.getHashParams();
        const WebApi = new Spotify();

        this.state ={
            render:'',
            loggedIn: params.access_token ? true : false,
            spotifyWebApi: WebApi
        }

        if (this.state.loggedIn){
            this.state.render = 'new'}
        if (params.access_token){
            this.state.spotifyWebApi.setAccessToken(params.access_token);
        }
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
            case 'login': window.location.assign('http://localhost:8888/login')
            case 'new': return <NewRoom {...this.state}/>              
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