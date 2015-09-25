import $ from 'jquery'
import LapsocarteAppController from './LapsocarteAppController/LapsocarteAppController.js';

require('./app.css');

var lapsocarteAppController = new LapsocarteAppController();

$(function () {
    lapsocarteAppController.init();
});