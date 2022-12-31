import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';


@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {
  constructor(
    //creo las propiedades
    private placesService:PlacesService,
    private mapService:MapService
  ){}

  //ir a navegar
  goToMyLocation(){
    // console.log('ir a mi ubicación')
   //hacer la validacion, sino esta listo
   if ( !this.placesService.isUserLocationReady) throw Error('No hay ubicación de usuario');
   if ( !this.mapService.isMapReady ) throw Error('No hay mapa disponible');
   
   
   this.mapService.flyTo( this.placesService.useLocation! );
  }
}
