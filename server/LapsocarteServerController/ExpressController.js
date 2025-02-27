import * as glbs from '../../Globals.js'

import MainController from './LapsocarteServerController.js'

let _mainController;
let _express;
let _app;
let _server;

export default class ExpressController {
    constructor() {
        _mainController = new MainController();
        _express = require('express');
        _app = _express();

        let compress = require('compression');
        _app.use(compress());

        _server = require('http').createServer(_app);
    }

    mc_init() {
        _app.use(glbs.PROJECT.PATH, _express.static(PathHelper.relativeToAbsolute('../../app/public')));
        _app.get(glbs.PROJECT.PATH, function(req, res) {
            res.sendFile(PathHelper.relativeToAbsolute('../../app/index.html'));
        });
        _server.listen(glbs.PROJECT.PORT, function() {
            console.log('ExpressController.init() :: Server listening on localhost:'+glbs.PROJECT.PORT+glbs.PROJECT.PATH);
        });

        _mainController.sc_ready(this);
    }

    mc_getServer() {
        return _server;
    }
}

class PathHelper {
    static relativeToAbsolute(relativePath) {
        let base = __dirname.split('/');
        let relative = relativePath.split('/');

        let temp = [];

        let dir = relative.pop();
        while (dir != '..') {
            base.pop();
            temp.push(dir);
            dir = relative.pop();
        }

        dir = temp.pop();
        while (dir !== undefined){
            base.push(dir);
            dir = temp.pop();
        }
        return base.join('/');
    }
}
