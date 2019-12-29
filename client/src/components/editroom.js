import React, { Component } from 'react';
import HostRoom from './hostroom'
import Search from './search'
import List from 'react-list-select'


import '../App.css';

class EditRoom extends Component {
    constructor(){
        super();
        this.state = {
            ...this.props,
            selectedResults: [],
            render: ''
        }
    }

    search(){
        this.setState({render:'search'});
    }

    delete(){
        var id;
        var index;

        for (var i = 0; i < this.state.selectedResults.length; i++){
            index = this.state.selectedResults[i];
            id = this.props.newroom.roomTracks[index].id;

            this.props.home.spotifyWebApi.removeTracksFromPlaylist(this.props.home.userInfo.id, this.props.newroom.selectedPlaylistID, ["spotify:track:" + id])
            .then(function(data) {
                console.log('Tracks removed!');
            }, function(err) {
                console.error('Something went wrong!', err);
            });

            this.props.newroom.roomTracks.splice(index,1);

            this.back()

        }
    }

    back(){
        this.setState({render:'back'});
    }

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});        
    }

    handleSelectChange(selected) {
        console.log(this.state.selectedResults);
        // If clicked option already exists, remove it to reflect a deselect.
        var appendSelected = this.state.selectedResults;
        var check = 1;
        for( var i = 0; i < appendSelected.length; i++){ 
            if (appendSelected[i] === selected[0]){
                appendSelected.splice(i, 1); 
                i--;
                check = 0;
            }
        }
        // Otherwise add the selection.
        if (check > 0){
            appendSelected.push(selected[0]);
        }

        this.setState({selectedResults: appendSelected});
        console.log(this.state.selectedResults);
    }

    _renderSubComp(){
        switch(this.state.render){
            case 'back': return <HostRoom {...this.props}/>
            case 'search': return <Search {...this.props}/>

            default: return ( 
            <div>   
                <div>
                    <h2>Edit Room Queue:<br/></h2>
                        
                    <List className="list_1"
                        items={this.props.newroom.roomTracks.map(this.MakeItem)}
                        selected={[]}
                        disabled={[]}
                        multiple={true}
                        onChange={(selected: number) => { this.handleSelectChange(selected) }}
                    />

                    <br/>                
                    <button id="l-shift" onClick={() => this.back()}>
                    &#8592; Back
                    </button> 
                    <button id="centre" onClick={() => this.delete()}>
                        Delete
                    </button>
                    <button id="r-shift" onClick={() => this.search()}>
                        Find New Songs &#8594;
                    </button>
                    
                </div>
            </div>
            );
        }
    }

    MakeItem = function(X, i) {
        return <li key={i}>{X.name}</li>;
      };

    render() {
      return (
        <div className="EditRoom">        
          {this._renderSubComp()}
        </div>      
      );
    }
  }
  
  
export default EditRoom;