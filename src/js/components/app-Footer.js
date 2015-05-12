/** @jsx React.DOM */
var React = require('react');
var Mui = require('material-ui');
var RaisedButton = Mui.RaisedButton;

var Footer = React.createClass({
    render: function () {
        return (
            <div className="btn-group btn-group-justified" style={{position:'fixed', bottom:'0'}}>
                <a className="btn btn-cancel btn-lg"
                   onClick={this.props.secondaryClick}>
                    {this.props.secondaryText}
                </a>
                <a className="btn btn-success btn-lg btn-alt waves-button waves-effect waves-light"
                   onClick={this.props.primaryClick}>
                    {this.props.primaryText}
                </a>
            </div>
        );
    }
});

module.exports = Footer;