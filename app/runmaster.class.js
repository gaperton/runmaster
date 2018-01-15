import { HeartRateSensor } from "heart-rate";
import { geolocation } from "geolocation";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { today } from "user-activity";
import { Application } from './view'
import { battery } from "power";
import clock from "clock";

class runMaster {
  //heart rate
  hrm=0;                                // reference to the sensor object
  hrmread=0;                            // current hrmreading
  maxHR=0;                              // max HR recorded
  totalHR=0;                            // summary of all HR readings
  countHR=0;                            // count of HR readings taken
  targetHR=0;                           // target heartrate for session
  
  //cadence
  targetspm=0;                          // object used for setting the metronome -- 0 is off!!
  averagespm=0;                         // number of steps
  laststeps=-1;                         // last steps reading
  totalsteps=0;                         // activity total steps
  
  // activity duration
  lastTime=0;                           // previous time reading
  startTime=0;                          // activity start time
  endTime=0;                            // activity end time
  currentTime=0;                        // current time reading
  duration=0;                           // running time (not moving time i.e. time not paused or stopped)

  //distance
  distance=0;                           // calculate distance from GPS coordinates
  
  //gps
  gpsConnected=false;                   // has GPS sensor connected to the satellite network
  gpsWatchID=0;                         // reference to the geolocation watch position object
  heading=0;                            // current heading
  lastlat=-999;                         // previous latitude
  lastlon=-999;                         // previous longitude
  lat=0;                                // current latitude
  lon=0;                                // current longitude
  lastaltitude=-999                     // previous altitude
  altitude=0;                           // current altitude
  totalascent=0;                        // total ascent
  totaldescent=0;                       // total descent
  speed=0;                              // current speed

  // pace
  targetPace=0                          // target pace for activity
  targetPaceUpperAlert=0;               // upper acceptable limit for activity
  targetPaceLowerAlert=0;               // lower acceptable limit for activity
  expectedDurationBasedOnActualPace=0;  // expected duration if current average pace is maintained
  
  //application
  started='N';                          // has the activity been started?
  readingNumber=0;                      // the number of gps readings taken (this is different to the number of recordings of data logged)
  sensorLogTimer=0;                     // reference to the timer object set to log the current readings
  sensorReadTimeMS=5000;                // number of milliseconds
  clockDisplay=preferences.clockDisplay // user clock display preference
  distanceUnits=units.distance;         // user distance units preference

  start() {
    clock.granularity = "seconds";
    clock.ontick = (evt) => {
       this.refreshScreenData(evt);
    }
    this.laststeps=today.local.steps;
    this.lastTime = this.currentTime = new Date();
    if (this.startTime===0) { this.startTime = new Date(); }
    this.sensorLogTimer=setInterval(() => this.logCurrentReadings(),this.sensorReadTimeMS);
    if (this.started==='N') {
      this.hrm=new HeartRateSensor();
      this.hrm.onreading = () => this.hrmbeat();
      this.gpsWatchID = geolocation.watchPosition(this.gpsBeat,this.gpsError);
      this.hrm.start();
    }
    this.started='Y';
  }
  pause() {
    this.started='P';
    clearInterval(this.sensorLogTimer);
    console.log("Pause");
  }
  stop() {
    this.hrm.start();
    clearInterval(this.sensorLogTimer);
    geolocation.clearWatch(this.gpsWatchID);
    this.started='N';
    console.log("Stop");
  }
  
  refreshScreenData = (evt) =>  {
    this.currentTime = new Date();
    this.duration+=this.currentTime-this.lastTime;
    this.lastTime=this.currentTime;
    let newsteps=today.local.steps;
    this.totalsteps+=newsteps-this.laststeps;
    this.laststeps=newsteps;
    this.averagespm=this.totalsteps/(this.duration/1000);
    Application.instance.render();
  }
  // method to take the current heartrate reading
  hrmbeat() {
    this.countHR++;
    this.hrmread=this.hrm.heartRate;
    if (this.hrmread>this.maxHR) { this.maxHR=this.hrmread; }
    this.totalHR+=this.hrmread;
  }
  // method to return the average heartrate recorded
  averageHR() {
    return parseInt(this.totalHR/this.countHR);
  }

  gpsBeat = position => {
    this.gpsConnected=true;
    this.lastlat=this.lat;
    this.lastlon=this.lon;
    this.lat=position.coords.latitude;
    this.lon=position.coords.longitude;
    this.speed=position.coords.speed;
    this.altitude=position.coords.altitude;
    if (this.lastaltitude===-999) { this.lastaltitude=this.altitude; }
    if (this.altitude>this.lastaltitude) {
      this.totalascent+=this.altitude-this.lastaltitude;
    } else {
      this.totaldescent+=this.lastaltitude-this.altitude;
    }
    this.lastaltitude=this.altitude;
    this.heading=position.coords.heading;
    this.readingNumber++;
    this.distance+=this.calcDistance(this.lastlat,this.lastlon,this.lat,this.lon);
  }

  // get distance between two coords
  calcDistance(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c * 1000; // Distance in metres
    if (d>1000) { d=0; }
    return d;
  }

  deg2rad(deg) {
    
    return deg * (Math.PI/180);
  }

  gpsError = () => {
    console.log("GPS Error");
  }

  logCurrentReadings() {
    Application.instance.render();
    //console.log("Connected="+this.gpsConnected+" HR="+this.hrmread+" lat="+this.lat.toFixed(5)+" lon="+this.lon.toFixed(5)+" speed="+this.speed+" altitude="+this.altitude+" Heading="+this.heading+" Reading #"+this.readingNumber+" Units="+this.distanceUnits+" Clock="+this.clockDisplay)
    //console.log("Distance="+this.distance.toFixed(2)+" Steps="+this.totalsteps+" Ascent="+this.totalascent.toFixed(2)+" Descent="+this.totaldescent.toFixed(2));
  }

  returnTargetSPM() {
    return this.targetspm;
  }
  returnval() {
    return this.hrmread;
  }

  status() {
    return this.started;
  }

}
export default new runMaster();