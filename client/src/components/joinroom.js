import React, { Component } from 'react';

// Components
import GuestRoom from './guestroom'

class JoinRoom extends Component {
    constructor(){
        super();
        this.state = {
            render: '',
            name: '',
            accessCode: ''}
    }

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }

    _renderSubComp(){
        switch(this.state.render){
            case 'next':
                if (this.state.name != '' && this.state.accessCode != '') {
                    return <GuestRoom {...this.state}/>
                } else {
                    return <div> Please enter a valid name and/or access code!</div>
                }
            default: return null;
        }
    }

    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    handleChangeAccessCode(event) {
        this.setState({accessCode: event.target.value});
    }

    render() {
      return (
        <div className="JoinRoom">
            <form>
                <label>
                    Name:
                    <input type="text" onChange={this.handleChangeName.bind(this)} />
                </label>
            </form>

            <form>
                <label>
                    Access Code:
                    <input type="text" onChange={this.handleChangeAccessCode.bind(this)} />
                </label>
            </form>

            <button onClick={this.handleClick.bind(this, 'next')}>Next</button>
            {this._renderSubComp()}
        </div>      
      );
    }
  }
  
export default JoinRoom;