import React, { Component } from 'react';

class GuestRoom extends Component {
    constructor(){
        super();
        this.state = {...this.props}
    }

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }
    _renderSubComp(){
        switch(this.state.render){
            case 'new': return <div>this is the guest room</div>
            default: return null;
        }
    }

    render() {
      return (
        <div className="GuestRoom">        
          <button onClick={this.handleClick.bind(this, 'new')}>Guest Room</button>
          {this._renderSubComp()}
        </div>      
      );
    }
  }
  
export default GuestRoom;