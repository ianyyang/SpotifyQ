import React, { Component } from 'react';
import './App.css';

// Components
import Home from './components/home'

class App extends Component {
    render() {
        return (
            <div className="App">

                <Home {...this.state}/>

            </div>
        );
    }
}

export default App;