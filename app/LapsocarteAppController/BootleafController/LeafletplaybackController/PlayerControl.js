import MainController from './LeafletplaybackController.js'

import $ from 'jquery';
require('jquery-ui');
import L from'leaflet';

let _mainController;
let _leafletControl;
let _timeVector;

export default class PlaybackControl {
    constructor(timeVector) {
        _mainController = new MainController();
        _timeVector = timeVector;

        _leafletControl = new L.control();
        this._setupControl();
    }

    mc_getLeafletControll() {
        return _leafletControl;
    }

    _setupControl() {
        _leafletControl.setPosition('bottomleft');
        _leafletControl.onAdd = function(map) {
            _leafletControl._html = HTMLhelper.getPlayerHTML();
            $('#map').after(_leafletControl._html);
            _setupListeners();

            return L.DomUtil.create('div');
        };

        function _setupListeners() {
            $('#play-pause').click(function() {
                if (!_mainController.pc_isPlaying()) {
                    _mainController.pc_play();
                    $('#play-pause-icon').removeClass('fa-play');
                    $('#play-pause-icon').addClass('fa-pause');
                } else {
                    _mainController.pc_stop();
                    $('#play-pause-icon').removeClass('fa-pause');
                    $('#play-pause-icon').addClass('fa-play');
                }
            });

            $('#cursor-date').html(_timeVector[0]);
            $('#cursor-time').html('['+_timeVector[0]+' ... '+_timeVector[_timeVector.length-1]+']');
            $('#time-slider').slider({
                min: _timeVector[0],
                max: _timeVector[_timeVector.length-1],
                step: 1,
                value: _timeVector[0],
                slide: function( event, ui ) {
                    _mainController.pc_movedTo(ui.value);
                    $('#cursor-time').val(ui.value.toString());
                    //$('#cursor-time-txt').html(new Date(ui.value).toString());
                }
            });

        }
    }

    static getPlaybackControl() {
            $('#speed-slider').slider({
                min: -9,
                max: 9,
                step: .1,
                value: self._speedToSliderVal(1), // this.playback.getSpeed()),
                orientation: 'vertical',
                slide: function( event, ui ) {
                    var speed = self._sliderValToSpeed(parseFloat(ui.value));
                    playback.setSpeed(speed);
                    $('.speed').html(speed).val(speed);
                }
            });

            $('#speed-input').on('keyup', function(e) {
                var speed = parseFloat($('#speed-input').val());
                if (!speed) return;
                playback.setSpeed(speed);
                $('#speed-slider').slider('value', speedToSliderVal(speed));
                $('#speed-icon-val').html(speed);
                if (e.keyCode === 13) {
                    $('.speed-menu').dropdown('toggle');
                }
            });

            $('#calendar').datepicker({
                changeMonth: true,
                changeYear: true,
                altField: '#date-input',
                altFormat: 'mm/dd/yy',
                defaultDate: new Date(playback.getTime()),
                onSelect: function(date) {
                    var date = new Date(date);
                    var time = $('#timepicker').data('timepicker');
                    var ts = self._combineDateAndTime(date, time);
                    playback.setCursor(ts);
                    $('#time-slider').slider('value', ts);
                }
            });

            $('#date-input').on('keyup', function(e) {
                $('#calendar').datepicker('setDate', $('#date-input').val());
            });

            $('.dropdown-menu').on('click', function(e) {
                e.stopPropagation();
            });

            $('#timepicker').timepicker({
                showSeconds: true
            });

            $('#timepicker').timepicker('setTime',
                new Date(playback.getTime()).toTimeString());

            $('#timepicker').timepicker().on('changeTime.timepicker', function(e) {
                var date = $('#calendar').datepicker('getDate');
                var ts = self._combineDateAndTime(date, e.time);
                playback.setCursor(ts);
                $('#time-slider').slider('value', ts);
            });

            $('#load-tracks-btn').on('click', function(e) {
                $('#load-tracks-modal').modal();
            });

            $('#load-tracks-save').on('click', function(e) {
                var file = $('#load-tracks-file').get(0).files[0];
                self._loadTracksFromFile(file);
            });
        };
}

class HTMLhelper {
    static getPlayerHTML() {
        let html = '<footer class="lp">  <div class="transport">    <div class="navbar navbar-default">      <div class="container">        <ul class="nav navbar-nav">          <li class="ctrl">            <a id="play-pause" href="#"><i id="play-pause-icon" class="fa fa-play fa-lg"></i></a>          </li>          <li class="ctrl dropup">            <a id="clock-btn" class="clock" data-toggle="dropdown" href="#">              <span id="cursor-date"></span><br>              <span id="cursor-time"></span>            </a>            <div class="dropdown-menu" role="menu" aria-labelledby="clock-btn">              <label>Playback Cursor Time</label>              <div class="input-append bootstrap-timepicker">                <input id="timepicker" type="text" class="input-small span2 form-control">                <span class="add-on"><i class="fa fa-clock-o"></i></span>              </div>              <div id="calendar"></div>              <div class="input-append">                <input id="date-input" type="text" class="input-small form-control">                <span class="add-on"><i class="fa fa-calendar"></i></span>              </div>            </div>          </li>        </ul>        <ul class="nav pull-right navbar-nav">          <li>            <div id="time-slider"></div>          </li>          <li class="ctrl dropup">            <a id="speed-btn" data-toggle="dropdown" href="#"><i class="fa fa-dashboard fa-lg"></i> <span id="speed-icon-val" class="speed">1</span>x</a>            <div class="speed-menu dropdown-menu" role="menu" aria-labelledby="speed-btn">              <label>Playback<br>Speed</label>              <input id="speed-input" class="span1 speed form-control" type="text" value="1">              <div id="speed-slider"></div>            </div>          </li>          <li class="ctrl">            <a id="load-tracks-btn" href="#"><i class="fa fa-map-marker fa-lg"></i> Tracks</a>          </li>        </ul>      </div>    </div>  </div></footer><div id="load-tracks-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="load-tracks-label" aria-hidden="true">  <div class="modal-header">    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>    <h3 id="load-tracks-label">Load GPS Tracks</h3>  </div>  <div class="modal-body">    <p>      Leaflet Playback supports GeoJSON and GPX files. CSV support coming soon!    </p>    <label>Upload a File</label>    <input type="file" id="load-tracks-file" class="form-control">  </div>  <div class="modal-footer">    <button class="btn btn-default" data-dismiss="modal" aria-hidden="true">Cancel</button>    <button id="load-tracks-save" class="btn btn-primary">Load</button>  </div></div>';
        return html;
    }
}

