import React, { Component } from 'react';
 
import HostRoom from './hostroom'

class Search extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            search: '',
            searchResults: [],
            selectedResult: ''
        }
    }

    searchAll() {
        this.props.props2.props1.spotifyWebApi.searchTracks(this.state.search, ['track'])
        .then((response) => {
        //console.log('Search success!', response);
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

    addTrack(id) {
        this.props.props1.spotifyWebApi.addTracksToPlaylist(this.props.props1.userInfo.id,this.props.props2.props1.sele, ["spotify:track:" + id])
        .then(function(data) {
          console.log('Added tracks to playlist!');
        }, function(err) {
          console.log('Something went wrong!', err);
        });
    }

    handleChange(event) {
        this.setState({search: event.target.value});
      }

    handleSearchChange(event) {
        this.setState({selectedResult: event.target.value});
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
                    </form>

                    <button onClick={() => this.searchAll()}>
                        Search All
                    </button>
                    <div>
                        <label>Choose Track: <br/>
                            <ul id="tracks">{
                                this.state.searchResults.map(this.MakeItem)}
                            </ul>
                        </label>
                    </div>
                </div>
            );
        }
    }

    MakeItem = function(X, i) {
        return <option key={i}>{X.name + '(' + <a href="#" onClick="{this.addTrack.bind(this, X.id)}"> + </a> + ')'}</option>;
      };

    render() {
        return (
            <div className="Search">        
                {this._renderSubComp()}
            </div>      
        );
    }
}
 
export default Search;