/* jshint globalstrict: true, node: true */
/* global document */
"use strict";

var App = require("./app.jsx");
var React = require("react");

React.render(<App />, document.querySelector("#content"));
