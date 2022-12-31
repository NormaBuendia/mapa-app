import { Component } from '@angular/core';
import { PlacesService } from '../../services';


@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})
export class MapScreenComponent  {
  
constructor(private placesService:PlacesService){ }
// getter que este pendiente de una propiedad que este en nuestro servicio
get isUserLocationReady(){
  return this.placesService.isUserLocationReady
}

}
