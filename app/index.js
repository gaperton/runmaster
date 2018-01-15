import document from "document";
import { Application } from './view'
import { Screen1 } from './screen1'
import { EntryScreen } from './screen-entry'
import { ExitScreen } from './screen-exit'
import { SummaryScreen } from './screen-summary'
import runMaster from './runmaster.class'
import { me } from "appbit";
import { vibration } from "haptics";


class MultiScreenApp extends Application {
    screen1 = new Screen1();
    EntryScreen = new EntryScreen();
    ExitScreen = new ExitScreen();
    SummaryScreen = new SummaryScreen();
    currentScreen='EntryScreen';
    //currentScreen='SummaryScreen';

    exitApp() {
      this.unmount();
      me.exit();
    }

    // Called once on application's start...
    onMount(){
        Application.switchTo(this.currentScreen);
        runMaster.start();

        document.onkeypress = this.onKeyPress;
    }

    onUnmount() {
      runMaster.stop();
    }

    // Event handler, must be pinned down to the class to preserve `this`.
    onKeyPress = e => {
        vibration.start("bump");
        e.preventDefault();
      
        if( e.key === 'down' ){
            // Just switch between two screens we have.
            Application.switchTo( this.screen === this.screen1 ? 'EntryScreen' : 'screen1' );
        }
        if( e.key === 'back') {
            if (this.screen === this.screen1) { this.currentScreen='screen1'; }
            if (this.screen === this.Entryscreen) { this.currentScreen='EntryScreen'; }
            Application.switchTo( this.screen === this.ExitScreen ? this.currentScreen : 'ExitScreen' );
        }
    }   
}

// Create and start the application.
MultiScreenApp.start();