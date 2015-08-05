/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    AppActions = require('../actions/app-actions'),
    Header = require('../components/app-Header'),
    Loader = require('../components/app-Loader'),
    Toast = require('../components/app-Toast'),
    About = require('../components/app-About'),
    InfoBar = require('../components/app-InfoBar'),
    MainCard = require('../components/app-MainCard'),
    AuthMixin = require('../mixins/app-AuthMixin'),
    StateMixin = require('../mixins/app-StateMixin');

var Container = React.createClass({
    mixins: [AuthMixin, StateMixin],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        "use strict";
        var height = {
            'height': document.documentElement.clientHeight - 40
        };

        return {
            "componentHeight": height
        };
    },
    componentWillMount: function () {
        "use strict";
        AppActions.fetchIssues();
    },
    handleResize: function () {
        "use strict";
        var height = {
            'height': document.documentElement.clientHeight - 40
        };

        if (this.isMounted()) {
            this.setState({componentHeight: height});
        }
    },
    componentDidMount: function () {
        "use strict";
        window.addEventListener('resize', this.handleResize);
    },
    render: function () {
        "use strict";
        return (
            <div>
                <Header ref="header" />
                <Loader isLoading={this.state.isLoading}/>
                <Toast error={this.state.error}/>
                <div className="container" style={{height: this.state.componentHeight.height + 'px'}}>
                    <div className="container-inner">
                        <InfoBar ref="infoBar"/>
                        <MainCard />
                    </div>
                </div>
                <About />
            </div>
        );
    }
});

module.exports = Container;