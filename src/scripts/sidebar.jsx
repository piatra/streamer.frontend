/* jshint globalstrict: true, node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({
  displayName: "Sidebar",

  render: function() {
    return <div className="sidebar">
      <button className="close" onClick={this.props.onClose}>&times;</button>
      {this.props.cluster ? this.renderTweetList() : this.errorMessage()}
    </div>;
  },

  errorMessage: function() {
    return <h3>
      No tweets available for this cluster.
    </h3>;
  },

  renderTweetList: function() {
    if (this.props.cluster) {
      return <div>
        <p>{this.props.cluster.length} tweets</p>
        <ul>
          {this.props.cluster.map(this.tweetMarkup)}
        </ul>
      </div>;
    }

    return <h3>An error has occured</h3>;
  },

  tweetMarkup: function(tweet, id) {
    if (tweet.length === 2) {
      return <li key={id}>
        @{tweet[1][0]}: {tweet[1][1]}
      </li>;
    }
  }
});
