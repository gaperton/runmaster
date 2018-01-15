import { View, $at } from './view'
import { vibration } from "haptics";
import runMaster from './runmaster.class';

// Create the root selector for the view...
const $ = $at( '#EntryScreen' );

export class EntryScreen extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    el = $();
    cadenceTimer=0;
  
    entryscreendom = new entryScreenDOM();


    // Lifecycle hook executed on `view.mount()`.
    onMount(){
        // TODO: insert subviews...
        // TODO: subscribe for events...
        this.cadenceTimer=setInterval(() => this.timerEvent(),60*1000/runMaster.returnTargetSPM());
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount(){
        clearInterval(this.cadenceTimer);
        // TODO: unsubscribe from events...
    }

    // Custom UI update logic, executed on `view.render()`.
    onRender(){
        // TODO: put DOM manipulations here...
        // Call this.render() to update UI.
        this.entryscreendom.render( runMaster.lat, 
                                    runMaster.lon, 
                                    runMaster.altitude, 
                                    runMaster.hrmread, 
                                    runMaster.speed, 
                                    runMaster.heading,
                                    runMaster.distance,
                                    runMaster.totalascent, 
                                    runMaster.totaldescent, 
                                    runMaster.maxHR,
                                    runMaster.averageHR(), 
                                    runMaster.targetspm, 
                                    runMaster.averagespm,
                                    runMaster.totalsteps,
                                    runMaster.duration, 
                                    runMaster.startTime, 
                                    runMaster.endTime, 
                                    runMaster.currentTime );
    }

    timerEvent() {
      vibration.start("bump");
    }
}

// Elements group. Used to group the DOM elements and their update logic together.
class entryScreenDOM {
    lat = $( '#lat' );
    lon = $( '#lon' );
    altitude = $( '#alt' );
    hrmread = $( '#curHR' );
    currentSpeed = $ ( '#SPD' );
    currentHeading = $ ( '#HD' );
    currentDistance = $ ( '#distance' );
    ascent = $ ( '#ascent' );
    descent = $ ( '#descent' );
    maxHR = $ ( '#maxHR' );
    avgHR = $ ( '#avgHR' );
    targetCadence = $ ( '#targetCadence' );
    avgCadence = $ ( '#avgCadence' );
    totalsteps = $ ( '#totalSteps' );
    duration = $ ( '#duration' );
    startTime = $ ( '#startTime' );
    endTime = $ ( '#endTime' );
    currentTime = $ ( '#currentTime' );
    
    // UI update method(s). Can have any name, it's just the pattern.
    // Element groups have no lifecycle hooks, thus all the data required for UI update
    // must be passed as arguments.
    render( plat, plon, paltitude, phrmread, pcurrentSpeed, pcurrentHeading, pcurrentDistance, pascent, pdescent, pmaxHR, pavgHR, ptargetCadence, pavgCadence, ptotalsteps, pduration, pstartTime, pendTime, pcurrentTime ){
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
      this.duration.text = parseInt(pduration/1000);
      this.startTime.text = pstartTime;
      this.endTime.text = pendTime;
      this.currentTime.text = pcurrentTime;
    }
}
