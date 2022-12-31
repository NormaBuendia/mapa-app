import { Component } from '@angular/core';
import { PlacesService, MapService} from '../../services';
import { Feature } from '../../interfaces/places';




@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  //propiedad
  public selectedId:string='';

 constructor( 
  private placesServices:PlacesService,
  private mapService:MapService
  ) {}

 get isLoadingPlaces():boolean{
   return this.placesServices.isLoadingPlaces;
 }
//traigo las direcciones con el modelo de la interface
 get places():Feature[]{
  return this.placesServices.places
 }
// recibe el lugar de tipo feature
flyTo(place:Feature){
// id seleccionado
  this.selectedId=place.id;
  //extraigo la longitud y latitud
  const [ lng, lat ] = place.center;
  // voy a navegar a lat y long
  this.mapService.flyTo([lng,lat])
}

getDirections( place: Feature){
  //validacion, sino tenemos el useLocation
  if( !this.placesServices.useLocation) throw Error('no hay useLocation')
  //llamo al metodo creado en el servicio
  this.placesServices.deletePlaces();

  const start = this.placesServices.useLocation;
  // es igual al place, center que es de tipo number, number
  const end = place.center as [number, number];
  this.mapService.getRouteBetweenPoints( start, end);
}
}
