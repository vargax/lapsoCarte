import * as glbs from './../Globals.js'
import * as support from './LapsocarteAppController/GUIController/Support.js'
import LapsocarteAppController from './LapsocarteAppController/LapsocarteAppController.js';

import $ from 'jquery'

support.HandlebarsHelper.loadTemplates();
let lapsocarteAppController = new LapsocarteAppController();

$(function () {
    // Only init the app when everything is ready...
    lapsocarteAppController.init();
});
