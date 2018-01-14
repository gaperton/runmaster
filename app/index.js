'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var document = _interopDefault(require('document'));
var display = require('display');
var clock = _interopDefault(require('clock'));
var heartRate = require('heart-rate');
var geolocation = require('geolocation');
var userSettings = require('user-settings');
var userActivity = require('user-activity');
var haptics = require('haptics');
var appbit = require('appbit');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

















function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

var querySplitter = /\.|#|\S+/g;
function $(query, el) {
    var selectors = query.match(querySplitter);
    var root = el || document;
    for (var i = 0; root && i < selectors.length; i++) {
        var s = selectors[i];
        root = s === '#' ? $id(selectors[++i], root) :
            s === '.' ? $classAndType('getElementsByClassName', selectors[++i], root) :
                $classAndType('getElementsByTypeName', s, root);
    }
    return root;
}
function $id(id, arr) {
    if (Array.isArray(arr)) {
        var res = [];
        try {
            for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
                var el = arr_1_1.value;
                var x = el.getElementById(id);
                if (x)
                    res.push(x);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) _a.call(arr_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res;
    }
    return arr.getElementById(id);
    var e_1, _a;
}
function $classAndType(method, arg, arr) {
    if (Array.isArray(arr)) {
        var res = [];
        try {
            for (var arr_2 = __values(arr), arr_2_1 = arr_2.next(); !arr_2_1.done; arr_2_1 = arr_2.next()) {
                var el = arr_2_1.value;
                try {
                    for (var _a = __values(el[method](arg)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var el2 = _b.value;
                        res.push(el2);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (arr_2_1 && !arr_2_1.done && (_d = arr_2.return)) _d.call(arr_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return res;
    }
    return arr[method](arg);
    var e_3, _d, e_2, _c;
}
function $wrap(element) {
    return function (selector) { return selector ? $(selector, element) : element; };
}
function $at(selector) {
    return $wrap($(selector));
}
var View = (function () {
    function View(options) {
        if (options === void 0) { options = {}; }
        this._subviews = [];
        this.options = options;
    }
    View.prototype.mount = function () {
        var el = this.el;
        if (el)
            el.style.display = 'inline';
        this.onMount(this.options);
        return this;
    };
    View.prototype.onMount = function () { };
    View.prototype.insert = function (subview) {
        this._subviews.push(subview);
        return subview.mount();
    };
    View.prototype.unmount = function () {
        try {
            for (var _a = __values(this._subviews), _b = _a.next(); !_b.done; _b = _a.next()) {
                var subview = _b.value;
                subview.unmount();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this._subviews = [];
        this.onUnmount();
        var el = this.el;
        if (el)
            el.style.display = 'none';
        var e_4, _c;
    };
    View.prototype.onUnmount = function () { };
    View.prototype.remove = function (subview) {
        var _subviews = this._subviews;
        _subviews.splice(_subviews.indexOf(subview), 1);
        subview.unmount();
    };
    View.prototype.render = function () {
        if (display.display.on) {
            try {
                for (var _a = __values(this._subviews), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var subview = _b.value;
                    subview.render();
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_5) throw e_5.error; }
            }
            this.onRender();
        }
        var e_5, _c;
    };
    View.prototype.onRender = function () { };
    return View;
}());
var Application = (function (_super) {
    __extends(Application, _super);
    function Application() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Application.prototype, "screen", {
        get: function () { return this._screen; },
        set: function (view) {
            if (this._screen)
                this.remove(this._screen);
            display.display.poke();
            this.insert(this._screen = view).render();
        },
        enumerable: true,
        configurable: true
    });
    Application.switchTo = function (screenName) {
        var instance = Application.instance;
        instance.screen = instance[screenName];
    };
    Application.start = function () {
        var app = Application.instance = new this();
        app.mount();
        display.display.onchange = function () {
            app.render();
        };
    };
    Application.instance = null;
    return Application;
}(View));

var runMaster = (function () {
    function runMaster() {
        var _this = this;
        this.hrm = 0;
        this.hrmread = 0;
        this.maxHR = 0;
        this.totalHR = 0;
        this.countHR = 0;
        this.targetHR = 0;
        this.targetspm = 0;
        this.averagespm = 0;
        this.laststeps = -1;
        this.totalsteps = 0;
        this.lastTime = 0;
        this.startTime = 0;
        this.endTime = 0;
        this.currentTime = 0;
        this.duration = 0;
        this.distance = 0;
        this.gpsConnected = false;
        this.gpsWatchID = 0;
        this.heading = 0;
        this.lastlat = -999;
        this.lastlon = -999;
        this.lat = 0;
        this.lon = 0;
        this.lastaltitude = -999;
        this.altitude = 0;
        this.totalascent = 0;
        this.totaldescent = 0;
        this.speed = 0;
        this.targetPace = 0;
        this.targetPaceUpperAlert = 0;
        this.targetPaceLowerAlert = 0;
        this.expectedDurationBasedOnActualPace = 0;
        this.started = 'N';
        this.readingNumber = 0;
        this.sensorLogTimer = 0;
        this.sensorReadTimeMS = 5000;
        this.clockDisplay = userSettings.preferences.clockDisplay;
        this.distanceUnits = userSettings.units.distance;
        this.refreshScreenData = function (evt) {
            _this.currentTime = new Date();
            _this.duration += _this.currentTime - _this.lastTime;
            _this.lastTime = _this.currentTime;
            var newsteps = userActivity.today.local.steps;
            _this.totalsteps += newsteps - _this.laststeps;
            _this.laststeps = newsteps;
            _this.averagespm = _this.totalsteps / (_this.duration / 1000);
            Application.instance.render();
        };
        this.gpsBeat = function (position) {
            _this.gpsConnected = true;
            _this.lastlat = _this.lat;
            _this.lastlon = _this.lon;
            _this.lat = position.coords.latitude;
            _this.lon = position.coords.longitude;
            _this.speed = position.coords.speed;
            _this.altitude = position.coords.altitude;
            if (_this.lastaltitude === -999) {
                _this.lastaltitude = _this.altitude;
            }
            if (_this.altitude > _this.lastaltitude) {
                _this.totalascent += _this.altitude - _this.lastaltitude;
            }
            else {
                _this.totaldescent += _this.lastaltitude - _this.altitude;
            }
            _this.lastaltitude = _this.altitude;
            _this.heading = position.coords.heading;
            _this.readingNumber++;
            _this.distance += _this.calcDistance(_this.lastlat, _this.lastlon, _this.lat, _this.lon);
        };
        this.gpsError = function () {
            console.log("GPS Error");
        };
    }
    runMaster.prototype.start = function () {
        var _this = this;
        clock.granularity = "seconds";
        clock.ontick = function (evt) {
            _this.refreshScreenData(evt);
        };
        this.laststeps = userActivity.today.local.steps;
        this.lastTime = this.currentTime = new Date();
        if (this.startTime === 0) {
            this.startTime = new Date();
        }
        this.sensorLogTimer = setInterval(function () { return _this.logCurrentReadings(); }, this.sensorReadTimeMS);
        if (this.started === 'N') {
            this.hrm = new heartRate.HeartRateSensor();
            this.hrm.onreading = function () { return _this.hrmbeat(); };
            this.gpsWatchID = geolocation.geolocation.watchPosition(this.gpsBeat, this.gpsError);
            this.hrm.start();
        }
        this.started = 'Y';
    };
    runMaster.prototype.pause = function () {
        this.started = 'P';
        clearInterval(this.sensorLogTimer);
        console.log("Pause");
    };
    runMaster.prototype.stop = function () {
        this.hrm.start();
        clearInterval(this.sensorLogTimer);
        geolocation.geolocation.clearWatch(this.gpsWatchID);
        this.started = 'N';
        console.log("Stop");
    };
    runMaster.prototype.hrmbeat = function () {
        this.countHR++;
        this.hrmread = this.hrm.heartRate;
        if (this.hrmread > this.maxHR) {
            this.maxHR = this.hrmread;
        }
        this.totalHR += this.hrmread;
    };
    runMaster.prototype.averageHR = function () {
        return parseInt(this.totalHR / this.countHR);
    };
    runMaster.prototype.calcDistance = function (lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = this.deg2rad(lat2 - lat1);
        var dLon = this.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c * 1000;
        if (d > 1000) {
            d = 0;
        }
        return d;
    };
    runMaster.prototype.deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };
    runMaster.prototype.logCurrentReadings = function () {
        Application.instance.render();
    };
    runMaster.prototype.returnTargetSPM = function () {
        return this.targetspm;
    };
    runMaster.prototype.returnval = function () {
        return this.hrmread;
    };
    runMaster.prototype.status = function () {
        return this.started;
    };
    return runMaster;
}());
var runMaster$1 = new runMaster();

var $$1 = $at('#screen-1');
var Screen1 = (function (_super) {
    __extends(Screen1, _super);
    function Screen1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.el = $$1();
        _this.time = new Time();
        _this.seconds = 0;
        _this.onTick = function () {
            _this.seconds++;
            _this.render();
        };
        return _this;
    }
    Screen1.prototype.onMount = function () {
        clock.granularity = 'seconds';
        clock.ontick = this.onTick;
    };
    Screen1.prototype.onRender = function () {
        this.time.render(runMaster$1.returnval());
    };
    Screen1.prototype.onUnmount = function () {
        clock.granularity = 'off';
        clock.ontick = null;
    };
    return Screen1;
}(View));
var Time = (function () {
    function Time() {
        this.minutes = $$1('#minutes');
        this.seconds = $$1('#seconds');
    }
    Time.prototype.render = function (seconds) {
        this.minutes.text = (seconds / 60) | 0;
        this.seconds.text = seconds;
    };
    return Time;
}());

var $$2 = $at('#EntryScreen');
var EntryScreen = (function (_super) {
    __extends(EntryScreen, _super);
    function EntryScreen() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.el = $$2();
        _this.cadenceTimer = 0;
        _this.entryscreendom = new entryScreenDOM();
        return _this;
    }
    EntryScreen.prototype.onMount = function () {
        var _this = this;
        this.cadenceTimer = setInterval(function () { return _this.timerEvent(); }, 60 * 1000 / runMaster$1.returnTargetSPM());
    };
    EntryScreen.prototype.onUnmount = function () {
        clearInterval(this.cadenceTimer);
    };
    EntryScreen.prototype.onRender = function () {
        this.entryscreendom.render(runMaster$1.lat, runMaster$1.lon, runMaster$1.altitude, runMaster$1.hrmread, runMaster$1.speed, runMaster$1.heading, runMaster$1.distance, runMaster$1.totalascent, runMaster$1.totaldescent, runMaster$1.maxHR, runMaster$1.averageHR(), runMaster$1.targetspm, runMaster$1.averagespm, runMaster$1.totalsteps, runMaster$1.duration, runMaster$1.startTime, runMaster$1.endTime, runMaster$1.currentTime);
    };
    EntryScreen.prototype.timerEvent = function () {
        haptics.vibration.start("bump");
    };
    return EntryScreen;
}(View));
var entryScreenDOM = (function () {
    function entryScreenDOM() {
        this.lat = $$2('#lat');
        this.lon = $$2('#lon');
        this.altitude = $$2('#alt');
        this.hrmread = $$2('#curHR');
        this.currentSpeed = $$2('#SPD');
        this.currentHeading = $$2('#HD');
        this.currentDistance = $$2('#distance');
        this.ascent = $$2('#ascent');
        this.descent = $$2('#descent');
        this.maxHR = $$2('#maxHR');
        this.avgHR = $$2('#avgHR');
        this.targetCadence = $$2('#targetCadence');
        this.avgCadence = $$2('#avgCadence');
        this.totalsteps = $$2('#totalSteps');
        this.duration = $$2('#duration');
        this.startTime = $$2('#startTime');
        this.endTime = $$2('#endTime');
        this.currentTime = $$2('#currentTime');
    }
    entryScreenDOM.prototype.render = function (plat, plon, paltitude, phrmread, pcurrentSpeed, pcurrentHeading, pcurrentDistance, pascent, pdescent, pmaxHR, pavgHR, ptargetCadence, pavgCadence, ptotalsteps, pduration, pstartTime, pendTime, pcurrentTime) {
        this.lat.text = plat.toFixed(6);
        this.lon.text = plon.toFixed(6);
        this.altitude.text = paltitude;
        this.hrmread.text = phrmread;
        this.currentSpeed.text = pcurrentSpeed;
        this.currentHeading.text = pcurrentHeading;
        this.currentDistance.text = pcurrentDistance;
        this.ascent.text = pascent;
        this.descent.text = pdescent;
        this.maxHR.text = pmaxHR;
        this.avgHR.text = pavgHR;
        this.targetCadence.text = ptargetCadence;
        this.avgCadence.text = pavgCadence.toFixed(2);
        this.totalsteps.text = ptotalsteps;
        this.duration.text = parseInt(pduration / 1000);
        this.startTime.text = pstartTime;
        this.endTime.text = pendTime;
        this.currentTime.text = pcurrentTime;
    };
    return entryScreenDOM;
}());

var $$3 = $at('#ExitScreen');
var ExitScreen = (function (_super) {
    __extends(ExitScreen, _super);
    function ExitScreen() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.el = $$3();
        _this.btnYes = $$3('#btn-yes');
        _this.btnNo = $$3('#btn-no');
        return _this;
    }
    ExitScreen.prototype.onMount = function () {
        this.btnYes.onclick = function (evt) { Application.instance.exitApp(); };
        this.btnNo.onclick = function (evt) { Application.switchTo('screen1'); };
    };
    return ExitScreen;
}(View));

var $$4 = $at('#SummaryScreen');
var SummaryScreen = (function (_super) {
    __extends(SummaryScreen, _super);
    function SummaryScreen() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.el = $$4();
        _this.summaryscreendom = new summaryScreenDOM();
        return _this;
    }
    SummaryScreen.prototype.onMount = function () {
    };
    SummaryScreen.prototype.onUnmount = function () {
    };
    SummaryScreen.prototype.onRender = function () {
    };
    return SummaryScreen;
}(View));
var summaryScreenDOM = (function () {
    function summaryScreenDOM() {
        this.lat = $$4('#lat');
        this.lon = $$4('#lon');
        this.altitude = $$4('#alt');
        this.hrmread = $$4('#curHR');
        this.currentSpeed = $$4('#SPD');
        this.currentHeading = $$4('#HD');
        this.currentDistance = $$4('#distance');
        this.ascent = $$4('#ascent');
        this.descent = $$4('#descent');
        this.maxHR = $$4('#maxHR');
        this.avgHR = $$4('#avgHR');
        this.targetCadence = $$4('#targetCadence');
        this.avgCadence = $$4('#avgCadence');
        this.totalsteps = $$4('#totalSteps');
        this.duration = $$4('#duration');
        this.startTime = $$4('#startTime');
        this.endTime = $$4('#endTime');
        this.currentTime = $$4('#currentTime');
    }
    summaryScreenDOM.prototype.render = function (plat, plon, paltitude, phrmread, pcurrentSpeed, pcurrentHeading, pcurrentDistance, pascent, pdescent, pmaxHR, pavgHR, ptargetCadence, pavgCadence, ptotalsteps, pduration, pstartTime, pendTime, pcurrentTime) {
        this.lat.text = plat.toFixed(6);
        this.lon.text = plon.toFixed(6);
        this.altitude.text = paltitude;
        this.hrmread.text = phrmread;
        this.currentSpeed.text = pcurrentSpeed;
        this.currentHeading.text = pcurrentHeading;
        this.currentDistance.text = pcurrentDistance;
        this.ascent.text = pascent;
        this.descent.text = pdescent;
        this.maxHR.text = pmaxHR;
        this.avgHR.text = pavgHR;
        this.targetCadence.text = ptargetCadence;
        this.avgCadence.text = pavgCadence.toFixed(2);
        this.totalsteps.text = ptotalsteps;
        this.duration.text = parseInt(pduration / 1000);
        this.startTime.text = pstartTime;
        this.endTime.text = pendTime;
        this.currentTime.text = pcurrentTime;
    };
    return summaryScreenDOM;
}());

var MultiScreenApp = (function (_super) {
    __extends(MultiScreenApp, _super);
    function MultiScreenApp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.screen1 = new Screen1();
        _this.EntryScreen = new EntryScreen();
        _this.ExitScreen = new ExitScreen();
        _this.SummaryScreen = new SummaryScreen();
        _this.currentScreen = 'EntryScreen';
        _this.onKeyPress = function (e) {
            haptics.vibration.start("bump");
            e.preventDefault();
            if (e.key === 'down') {
                Application.switchTo(_this.screen === _this.screen1 ? 'EntryScreen' : 'screen1');
            }
            if (e.key === 'back') {
                if (_this.screen === _this.screen1) {
                    _this.currentScreen = 'screen1';
                }
                if (_this.screen === _this.Entryscreen) {
                    _this.currentScreen = 'EntryScreen';
                }
                Application.switchTo(_this.screen === _this.ExitScreen ? _this.currentScreen : 'ExitScreen');
            }
        };
        return _this;
    }
    MultiScreenApp.prototype.exitApp = function () {
        this.unmount();
        appbit.me.exit();
    };
    MultiScreenApp.prototype.onMount = function () {
        Application.switchTo(this.currentScreen);
        runMaster$1.start();
        document.onkeypress = this.onKeyPress;
    };
    MultiScreenApp.prototype.onUnmount = function () {
        runMaster$1.stop();
    };
    return MultiScreenApp;
}(Application));
MultiScreenApp.start();
