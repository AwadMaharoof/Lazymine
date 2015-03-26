/*Modification of http://tonyspiro.com/dev/react-typeahead-search*/
/** @jsx React.DOM */
var React = require('react');

var ListItem = React.createClass({
    render : function () {
        "use strict";
        var item = this.props.item;
        var id = this.props.id;

        return (
            <li>
              <a target="_blank" href={item.link} className="result" id={"result-" + id} data-id={id}>
                <i className={"fa " + item.icon}></i>
                <span className="description" dangerouslySetInnerHTML={{__html: item.formattedTitle}}></span>
                <br/>
                <span className="description" dangerouslySetInnerHTML={{__html: item.formattedContent}}></span>
              </a>
            </li>
        );
    }
});

module.exports = ListItem;
