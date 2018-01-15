import { View, $at } from './view'
import { Application } from './view'

const $ = $at( '#ExitScreen' );

export class ExitScreen extends View {
    el = $();

    btnYes = $( '#btn-yes' );
    btnNo = $( '#btn-no' );

    onMount(){
        this.btnYes.onclick = function(evt) { Application.instance.exitApp(); }
        this.btnNo.onclick = function(evt) { Application.switchTo( 'screen1' ); }
    }    
}