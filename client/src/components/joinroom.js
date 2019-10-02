import React, { Component } from 'react';

// Components
import GuestRoom from './guestroom'

class JoinRoom extends Component {
    constructor(){
        super();
        this.state = {
            render: '',
            invalid: false,
            name: '',
            accessCode: ''}
    }

    handleClick(e){
        console.log();
        if (this.state.name != '' && this.state.accessCode != '') {
            this.setState({invalid:false});
            this.setState({render:'next'});
        } else {
            this.setState({invalid:true});
        }
    }

    _renderInvalid(){
        switch(this.state.invalid){
            case true: return <div>Please enter a valid name and/or access code!</div>
            default: return null;
        }
    }

    _renderSubComp(){
        switch(this.state.render){
            case 'next': 
                return <GuestRoom {...this.state}/>
            default: return (
                <div class="JoinRoom">
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

                    <button onClick={this.handleClick.bind(this)}>Next</button>
                </div>
            );
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
            {this._renderSubComp()}
            {this._renderInvalid()}
        </div>      
      );
    }
  }
  
export default JoinRoom;