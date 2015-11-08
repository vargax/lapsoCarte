import $ from 'jquery'
import * as glbs from './../Globals.js'
import LapsocarteAppController from './LapsocarteAppController/LapsocarteAppController.js';

let lapsocarteAppController = new LapsocarteAppController();

$(function () {
    lapsocarteAppController.init();
});