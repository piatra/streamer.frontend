/* jshint globalstrict: true, node: true */
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
    var clusters = _.groupBy(this.state.tweets, function(t) {
      return t[0];
    });

    return <div>
      {Object.keys(clusters).map(function(id) {
        return <Tweet tweets={clusters[id]} clusterId={id} />;
      })}
      <Draw clusters={clusters} width={800} height={400} />
    </div>;
  },

  _fetchData: function() {
    $.get("http://localhost:8080")
      .success(this._updateClusters)
      .fail(this._updateClusters);
  },

  _updateClusters: function(data, status) {
    if (status !== "error") {
      this.setState({
        tweets: data
      });
    }
    setTimeout(this._fetchData, 2000);
  }
});
