import $ from 'jquery'
import LapsocarteAppController from './LapsocarteAppController/LapsocarteAppController.js';

var css = require('./app.css');

var lapsocarteAppController = new LapsocarteAppController();

$(function () {
    lapsocarteAppController.init();
});