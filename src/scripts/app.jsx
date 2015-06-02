/* jshint globalstrict: true, node: true */
/* global document */
"use strict";

var React = require("react");
var $     = require("jquery");
var Tweet = require("./tweet.jsx"),
    _     = require("lodash"),
    Draw  = require("./draw.jsx");

module.exports = React.createClass({
  displayName: "Main",

  getInitialState: function() {
    return {
      tweets: []
    };
  },

  componentDidMount: function() {
    setTimeout(this._fetchData, 2000);
  },

  render: function() {
    var dimensions = this.getDimensions();

    return <div>
      <Draw clusters={this.state.tweets} width={dimensions.width}
            height={dimensions.height}
            onCentroidHover={this.onCentroidHover} />
    </div>;
  },

  onCentroidHover: function(index) {
    var topics = this.getTopics(this.state.tweets[index]);

    console.log(topics); 
  },

  getTopics: function(cluster) {
    if (cluster) {
      var tweets = cluster.map(function(entry) {
        if (entry[1])
          return entry[1][1].split(" ").map(function(w) {
            return w.toLowerCase();
          });
      });

      return _.intersection.apply(null, tweets);
    }
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
    $.get("http://5.101.96.19:8001")
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
