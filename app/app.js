import $ from 'jquery'
import LapsocarteAppController from './LapsocarteAppController/LapsocarteAppController.js';

require('./app.css');

var lapsocarteAppController = new LapsocarteAppController();

$(function () {
    $('.timeslider').slider({
        value: 0,
        orientation: "horizontal",
        range: "min",
        animate: true
    });
    lapsocarteAppController.init();
});