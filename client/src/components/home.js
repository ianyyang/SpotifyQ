import React, { Component } from 'react';

// Components
import NewRoom from './newroom'
import JoinRoom from './joinroom'

class Home extends Component {
    render() {
      return (
        <div className="Home">
          
          <NewRoom />
          <JoinRoom />
  
        </div>
      );
    }
  }
  
export default Home;