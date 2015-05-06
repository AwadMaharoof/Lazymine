/** @jsx React.DOM */
var React = require('react');
var Mui = require('material-ui');
var DropDownMenu = Mui.DropDownMenu;
var DatePicker = Mui.DatePicker;
var TextField = Mui.TextField;
var tweenState = require('react-tween-state');
var AppActions = require('../actions/app-actions');

var Task = React.createClass({

    mixins: [tweenState.Mixin],

    activityId: 0,

    getInitialState: function() {
        return {
            open:false,
            class: "list-group-item"
        };
    },

    _handleClick: function(event) {
        if(this.state.open) {
            this.setState({
                open: false,
                class: "list-group-item"
            });
        }else{
            this.setState({
                open: true,
                class: "list-group-item open"
            });
        }
    },

    _elementClick: function(event){
        event.stopPropagation();
    },

    _activityChanged: function(e, selectedIndex, menuItem){
        this.activityId = menuItem.id;
    },

    _hourEntered: function(event){
        var spentHours = this.refs.spentHours.getValue();
        var comment = this.refs.comment.getValue();
        var today = new Date();
        AppActions.updateTime(this.props.item.id, this.activityId, spentHours, today, comment);

        event.stopPropagation();
    },
  
    render : function(){
        var activities = this.props.activities;
        var item = this.props.item;

        // Just get the first proper letter of the project
        var icontext = this.props.item.project.name.replace(/[^a-z]/gi,'').charAt(0);

        // Commented out. We might not need this.
        /*if(item.hasOwnProperty("time_updated") && item.time_updated == true){
            this.setState({
                open: false,
                class: "list-group-item updated"
            });
        }*/

        return (
            <div onClick={this._handleClick} className={this.state.class}>
                <div className="row-action-primary">
                    <i>{icontext}</i>
                </div>
                <div className="row-content">
                    <h4 className="list-group-item-heading">{item.project.name}</h4>
                    <p className="list-group-item-text">{item.subject}</p>
                </div>
                <div className="row-content task-input">
                    <div className="col-xs-12">
                      <TextField ref="comment" hintText="Comment" className="comment-box" onClick={this._elementClick}/>
                    </div>
                </div>
                <div className="row-content task-input">
                    <div className="tracker-dropdown-wrap" onClick={this._elementClick}>
                        <DropDownMenu menuItems={activities} className="tracker-dropdown" onChange={this._activityChanged}/>
                    </div>
                  <TextField ref="spentHours" hintText="Hours" className="hours-input" onClick={this._elementClick} onBlur={this._hourEntered}/>
                </div>
            </div>
        );
    }
});

module.exports = Task;
