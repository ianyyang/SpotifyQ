import React, { Component } from 'react';

class HostRoom extends Component {
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
            case 'new': return <div>this is the host room</div>
            default: return null;
        }
    }

    render() {
      return (
        <div className="HostRoom">        
          <button onClick={this.handleClick.bind(this, 'new')}>Host Room</button>
          {this._renderSubComp()}
        </div>      
      );
    }
  }
  
export default HostRoom;