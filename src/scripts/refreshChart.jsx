/* jshint globalstrict: true, node: true */
/* global document, d3 */

"use strict";

var React = require("react");

module.exports = React.createClass({
  displayName: "RefreshChart",

  render: function() {
    return <button onClick={this.props.redraw}>
      Redraw
    </button>;
  }
});
