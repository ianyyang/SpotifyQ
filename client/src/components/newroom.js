import React, { Component } from 'react';

import App from '../App-function'

class NewRoom extends Component {
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
            case 'new': return <App/>
        }
    }

    render() {
      return (
        <div className="NewRoom">        
          <button onClick={this.handleClick.bind(this, 'new')}>New Room</button>
          {this._renderSubComp()}
        </div>      
      );
    }
  }
  
export default NewRoom;