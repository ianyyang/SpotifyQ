import React, { Component } from 'react';
 
import HostRoom from './hostroom'

class Search extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            search: '',
            searchResults: []
        }
    }

    searchAll() {
        this.props.props2.props1.spotifyWebApi.searchTracks(this.state.search, ['track'])
        .then((response) => {
        console.log('Search success!', response);
        var json = response.tracks.items;
        var arr = [];
    
        Object.keys(json).forEach(function(key) {
            arr.push({
                name: json[key].name,
                id: json[key].id
            })
        });
    
        this.setState({
            searchResults: arr
            }, function(err) {
                console.error('Something went wrong!', err);
            });
        });
    }

    addTrack() {
        this.props.props1.spotifyWebApi.addTracksToPlaylist(this.props.props1.userInfo.id,'7Dcs93HOnJYPL6fJc9yqW2', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"])
        .then(function(data) {
          console.log('Added tracks to playlist!');
        }, function(err) {
          console.log('Something went wrong!', err);
        });
    }

    handleChange(event) {
        this.setState({search: event.target.value});
      }

    _renderSubComp() {
        switch(this.state.render){
            case 'search': return <div>this is the search room</div>
            default: return (
                <div>
                    <form>
                        <label>
                        Search:
                        <input type="text" value={this.state.search} onChange={this.handleChange.bind(this)} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>

                    <button onClick={() => this.searchAll()}>
                        Search All
                    </button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="Search">        
                {this._renderSubComp()}
            </div>      
        );
    }
}
 
export default Search;