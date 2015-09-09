/* jshint globalstrict: true, node: true */
/* global document */
"use strict";

var React = require("react");
var $     = require("jquery");
var Tweet = require("./tweet.jsx"),
    _     = require("lodash"),
    Draw  = require("./draw.jsx"),
    Sidebar = require("./sidebar.jsx");

module.exports = React.createClass({
  displayName: "Main",

  getInitialState: function() {
    return {
      tweets: [],
      sidebar: false,
      activeCluster: null
    };
  },

  componentDidMount: function() {
    setTimeout(this._fetchData, 2000);
  },

  render: function() {
    var dimensions = this.getDimensions();

    return <div>
      {this.renderSidebar()}
      <Draw clusters={this.state.tweets} width={dimensions.width}
            height={dimensions.height}
            onCentroidClick={this.loadSidebar} />
    </div>;
  },

  loadSidebar: function(id) {
    this.setState({
      sidebar: true,
      activeCluster: this.state.tweets[id] || null
    });
  },

  renderSidebar: function() {
    if (this.state.sidebar && this.state.activeCluster) {
      return <Sidebar cluster={this.state.activeCluster}
                      onClose={this.hideSidebar} />;
    }

    return null;
  },

  hideSidebar: function() {
    this.setState({
      siderbar: false,
      activeCluster: null
    });
  },

  getDimensions: function() {
    var body = document.body,
    html = document.documentElement;

    var height = Math.max(body.scrollHeight, body.offsetHeight, 
                          html.clientHeight, html.scrollHeight,
                          html.offsetHeight);

    var width = document.body.offsetWidth;

    return {
      width: width,
      height: height
    };
  },

  _fetchData: function() {
    $.get("http://45.55.8.25:8001")
      .success(this._updateClusters)
      .fail(this._updateClusters);
  },

  _updateClusters: function(data, status) {
    if (status !== "error") {
      var clusters = _.groupBy(data, function(t) {
        return t[0];
      });

      this.setState({
        tweets: clusters
      });
    }
    setTimeout(this._fetchData, 2000);
  }
});
