import MainController from './LapsocarteServerController.js'

export default class ExpressController {
    constructor() {
        this._mainController = new MainController();
        this._express = require('express');
        this._app = this._express();
        this._server = require('http').createServer(this._app);
    }

    mc_init() {
        this._app.use(this._express.static(PathHelper.relativeToAbsolute('../../app/public')));
        this._app.get('/', function(req, res) {
            res.sendFile(PathHelper.relativeToAbsolute('../../app/index.html'));
        });
        this._server.listen(8080, function() {
            console.log('ExpressController.init() :: Server ready and listening on port 8080');
        });
    }

    mc_getServer() {
        return this._server;
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
