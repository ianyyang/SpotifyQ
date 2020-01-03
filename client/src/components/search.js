import React, { Component } from 'react';
 
import HostRoom from './hostroom'
import EditRoom from './editroom'
import List from 'react-list-select'

class Search extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            search: '',
            searchResults: [],
            selectedResults: []
        }
    }

    searchAll() {
        this.props.home.spotifyWebApi.searchTracks(this.state.search, ['track'])
        .then((response) => {
        //console.log('Search success!', response);
        var json = response.tracks.items;
        var arr = [];
    
        Object.keys(json).forEach(function(key) {
            var artists = '';
                for (var i = 0; i < json[key].artists.length; i++){
                    artists += json[key].artists[i].name + ", ";
                }

            arr.push({
                name: json[key].name,
                artists: artists.slice(0, -2),
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
        this.props.home.spotifyWebApi.addTracksToPlaylist(this.props.home.userInfo.id,this.props.newroom.selectedPlaylistID, ["spotify:track:" + id])
        .then(function(data) {
          console.log('Added tracks to playlist!');
        }, function(err) {
          console.log('Something went wrong!', err);
        });
    }

    handleChange(event) {
        this.setState({search: event.target.value});
    }

    handleSelectChange(selected) {
        // If clicked option already exists, remove it to reflect a deselect.
        var appendSelected = this.state.selectedResults;
        var check = 1;
        for( var i = 0; i < appendSelected.length; i++){ 
            if (appendSelected[i] === selected[0]){
                appendSelected.splice(i, 1); 
                i--;
                check = 0;

                var add_element = document.getElementById(selected[0]);
                add_element.classList.add('react-list-select--item');
                add_element.classList.remove('react-list-add-selected--item');   
            }
        }
        // Otherwise add the selection.
        if (check > 0){
            appendSelected.push(selected[0]);
            var element = document.getElementById(selected[0]);
            element.classList.add('react-list-add-selected--item');
            element.classList.remove('react-list-select--item'); 
        }

        this.setState({selectedResults: appendSelected});
        console.log(this.state.selectedResults)
    }

    addToRoom(){
        var tracks = [];

        // Build tracklist based on selection indicies.
        for (var i = 0; i < this.state.selectedResults.length; i++){
            tracks.push(this.state.searchResults[this.state.selectedResults[i]]);
        }

        // make possibly multiple API call for each selected track.
        for( var i = 0; i < tracks.length; i++){ 
            this.addTrack(tracks[i].id);

            this.props.newroom.roomTracks.push({
                name: tracks[i].name,
                id: tracks[i].id
            })
        }

        this.setState({render:'next'});        
    }

    back(){
        this.setState({render:'back'});        
    }

    _renderSubComp() {
        switch(this.state.render){
            case 'next': return <HostRoom {...this.props}/>
            case 'back': return <EditRoom {...this.props}/>
            default: return (
                <div>
                    <form>
                        <label>
                        
                        <input type="text" value={this.state.search} onChange={this.handleChange.bind(this)} />
                        </label>

                    <button className="button_a" onClick={() => this.searchAll()}>
                        Search
                    </button>
                    </form>

                    
                    <div>
                        <h1>Search Results</h1>
                    </div>
                    <List className="react-list-select"
                        items={this.state.searchResults.map(this.MakeItem)}
                        selected={[]}
                        disabled={[]}
                        multiple={true}
                        onChange={(selected: number) => { this.handleSelectChange(selected) }}
                    />
                    <button className="button_a" onClick={() => this.back()}>&#8592; Back</button>

                    <button className="button_a" onClick={() => this.addToRoom()}>Add to Room &#8594;</button>

                </div>
            );
        }
    }

    MakeItem = function(X, i) {
        return (
        <div>
            <option id={i} key={i}>{X.name + " - " + X.artists}</option>
        </div>
        );
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