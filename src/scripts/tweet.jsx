/* jshint globalstrict: true, node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({
  displayName: "Tweet",

  getDefaultProps: function() {
    return {tweets: [], clusterId: 0};
  },

  render: function() {
    return <div>
      {this.props.tweets.map(function(tweet, id) {
        return <p key={this.props.clusterId + "" + id}>
          {tweet[0]} {tweet[1]}
        </p>;
      }.bind(this))}
      <hr />
    </div>;
  }
});
