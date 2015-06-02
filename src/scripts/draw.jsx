/* jshint globalstrict: true, node: true */
/* global document, d3 */

"use strict";

var React = require("react"),
    _     = require("lodash"),
    Redraw = require("./refreshChart.jsx");

module.exports = React.createClass({
  displayName: "Draw",

  getDefaultProps: function() {
    return {
      clusters: {},
      width: 200,
      height: 200,
      clusterRadius: 50
    };
  },

  getInitialState: function() {
    return {
      svg: null
    };
  },

  render: function() {
    if (this.renderCentroids() !== true) {
      return <div className="loading">
        <h2>Loading data...</h2>
      </div>;
    } else {
      return <div>
        <p>Total: {this.noOfTweets()} tweets</p>
        <Redraw redraw={this.renderCentroids} />
      </div>;
    }
  },

  componentDidMount: function() {
    this.points = [];

    var svgContainer = d3.select("#canvas svg")
      .attr("width", this.props.width)
      .attr("height", this.props.height);

    this.setState({
      svg: svgContainer
    });
  },
  
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.clusters[0]) {
      return _.any(this.props.clusters, function(v, k) {
        return v.length !== nextProps.clusters[k].length;
      });
    } else {
      return true;
    }

    return false;
  },

  noOfTweets: function() {
    return _.map(this.props.clusters, function(cluster) {
      return cluster.length;
    }).reduce(function(acc, l) { return acc + l; }, 0);
  },

  generateCentroids: function() {
    var noCentroids = Object.keys(this.props.clusters).length;
    var points = [];
    var p;
    for (var i = 0; i < noCentroids; ++i) {
      p = this.getCentroidPosition(this.props.width, i);

      points.push(this.generateCentroid(p.x, p.y, i));
    }

    return points;
  },

  generateClusterPoints: function(centroid, cid) {
    if (!this.props.clusters[cid])
      return;

    return this.props.clusters[cid].reduce(function(acc, cluster, idx) {
      if (cluster.length != 2)
        return;

      var coords = this.generateRandomPoint(centroid.x_axis, centroid.y_axis);
      var p = this.getPointProperties(coords.x, coords.y);
      p.tweet = this.props.clusters[cid][idx];
      acc.push(p);
      return acc;
    }.bind(this), []);
  },

  getCentroidPosition: function(width, i) {
    var diameter = this.props.clusterRadius * 4;
    var columns = Math.floor(width / diameter);

    var centroidRow = Math.floor(i / columns);
    var centroidCol = Math.floor(i % columns);

    var y0 = centroidRow * diameter;
    var x0 = centroidCol * diameter;

    return {
      x: x0 + diameter / 2,
      y: y0 + diameter / 2
    };
  },

  generateRandomPoint: function(x0, y0) {
    var rd = this.props.clusterRadius +
             Math.random() * this.props.clusterRadius / 2;

    var angle = Math.random() * Math.PI * 2;

    var y = Math.sin(angle) * rd;
    var x = Math.cos(angle) * rd;

    return {y: y + y0, x: x + x0};
  },

  generateCentroid: function(x, y, idx) {
    return { x_axis: x, y_axis: y, radius: 10, color : "red", index: idx };
  },

  getPointProperties: function(x, y) {
    return { x_axis: x, y_axis: y, radius: 3, color : "blue" };
  },

  renderCentroids: function() {
    var svgContainer = this.state.svg;

    if (!svgContainer || !Object.keys(this.props.clusters).length) {
      return null;
    }

    // clear the canvas
    this.state.svg.selectAll("*").remove();

    var jsonCircles = this.generateCentroids();
    var jsonPoints  = jsonCircles.map(this.generateClusterPoints);

    var tooltip = this.state.svg.append("foreignObject")
      .append("xhtml:div")
      .attr("class", "tooltip");

    jsonPoints.forEach(function(cluster, idx) {
      if (cluster)
        cluster.forEach(function(point) {
          svgContainer.append("line")
            .style("stroke", "black")
            .attr("x1", point.x_axis)
            .attr("y1", point.y_axis)
            .attr("x2", jsonCircles[idx].x_axis)
            .attr("y2", jsonCircles[idx].y_axis);
        });
    });

    var circles = this.state.svg.selectAll("circle")
      .data(jsonCircles.concat(_.flatten(jsonPoints)))
      .enter()
      .append("circle");

    circles
    .on("mouseover", function(d) {
      if (!d.tweet) {
        this.props.onCentroidHover(d.index);
      } else {
        tooltip
          .style("left", d.x_axis - 150 + "px")
          .style("top", d.y_axis + 20 + "px")
          .style("display", "block")
          .html(d.tweet[1][1]);
      }
    }.bind(this))
    .on("mouseout", function() {
      tooltip.style("display", "none");
    });

    var circleAttributes = circles
      .attr("cx", function (d) { if (d) return d.x_axis; })
      .attr("cy", function (d) { if (d) return d.y_axis; })
      .attr("r", function (d) { if (d) return d.radius; })
      .style("fill", function(d) { if (d) return d.color; });

    return true;
  }
});
