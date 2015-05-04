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
      return <div>
        <h2>Loading data...</h2>
      </div>;
    } else {
      return <Redraw redraw={this.renderCentroids} />;
    }
  },

  componentDidMount: function() {
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

  generateCentroids: function() {
    var noCentroids = Object.keys(this.props.clusters).length;
    var points = [];
    for (var i = 0; i < noCentroids; ++i) {
      var coords = this.generateRandomPoint(
        this.getRandomArbitrary(0, this.props.width),
        this.getRandomArbitrary(0, this.props.height)
      );
      points.push(this.generateCentroid(coords.x, coords.y));
    }

    return points;
  },

  generateClusterPoints: function(centroid, cid) {
    var points = [];
    this.props.clusters[cid].map(function(cluster, idx) {
      var coords = this.generateRandomPoint(centroid.x_axis, centroid.y_axis);
      var p = this.generatePoint(coords.x, coords.y);
      p.tweet = this.props.clusters[cid][idx];
      points.push(p);
    }.bind(this));

    return points;
  },

  getRandomArbitrary: function(min, max) {
    min += this.props.clusterRadius;
    max -= this.props.clusterRadius;
    return Math.random() * (max - min) + min;
  },

  generateRandomPoint: function(x0, y0) {
    var rd = this.props.clusterRadius;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    var xp = x/Math.cos(y0);

    return {"y": y + y0, "x": xp + x0};
  },

  generateCentroid: function(x, y) {
    return { "x_axis": x, "y_axis": y, "radius": 10, "color" : "red" };
  },

  generatePoint: function(x, y) {
    return { "x_axis": x, "y_axis": y, "radius": 3, "color" : "blue" };
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
      .attr("class", "tooltip")
      .html("a simple tooltip");

    jsonPoints.forEach(function(cluster, idx) {
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
        tooltip
          .style("left", d.x_axis - 150 + "px")
          .style("top", d.y_axis + 20 + "px")
          .style("display", "block")
          .html("Centroid");
      } else {
        tooltip
          .style("left", d.x_axis - 150 + "px")
          .style("top", d.y_axis + 20 + "px")
          .style("display", "block")
          .html(d.tweet[1][1]);

        d3.select(this)
          .style("stroke", "red")
          .attr("r", function(d) { return d.radius * 2; })
          .style("stroke-width", 2);
      }
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr("r", function(d) { return d.radius; })
        .style("stroke-width", 0);

      tooltip.style("display", "none");
    });

    var circleAttributes = circles
      .attr("cx", function (d) { return d.x_axis; })
      .attr("cy", function (d) { return d.y_axis; })
      .attr("r", function (d) { return d.radius; })
      .style("fill", function(d) { return d.color; });

    return true;
  }
});
