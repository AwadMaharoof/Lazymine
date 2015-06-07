/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    easyGid = require("easy-guid");

var Toast = React.createClass({
    getInitialState: function () {
        return {
            display: false
        };
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.error !== null){
            this.setState({
                display: true
            });
        }
    },
    _closeToast: function() {
        this.setState({
            display: false
        });
    },
    render: function () {
        "use strict";
        var output = null,
            identifier = easyGid.new();

        if (this.state.display) {
            output = <div className="toast toast-show">
                <div className="tooltip bottom in" id={identifier}
                     style={{top: '-654px', left: '223.703125px', display: 'block', position: 'relative'}}>
                    <div className="toast-inner tooltip-inner">
                        <a href="javascript:void(0)" className="pull-right" onClick={this._closeToast}>Dismiss</a>
                        <div className="toast-text">{ this.props.error.message }</div>
                    </div>
                </div>
            </div>
        }

        return (
            output
        );
    }
});

module.exports = Toast;