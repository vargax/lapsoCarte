import $ from 'jquery'
import * as glbs from './../Globals.js'
import LapsocarteAppController from './LapsocarteAppController/LapsocarteAppController.js';

require('./app.css');

let lapsocarteAppController = new LapsocarteAppController();

$(function () {
    $('.timeslider').slider({
        value: 0,
        orientation: "horizontal",
        range: "min",
        animate: true
    });
    lapsocarteAppController.init();
});