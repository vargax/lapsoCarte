import MainController from './LapsocarteAppController/LapsocarteAppController.js';
var css = require('./app.css');

var mainController = new MainController();
mainController.init();

//var c3 = require('c3');
//var chart = c3.generate({
//    bindto: '#chart',
//    data: {
//        columns: [
//            ['data1', 30, 200, 100, 400, 150, 250],
//            ['data2', 50, 20, 10, 40, 15, 25]
//        ]
//    }
//});