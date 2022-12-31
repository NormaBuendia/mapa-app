import { Injectable } from '@angular/core';
import { PlacesResponse, Feature } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from '.';




@Injectable({
  providedIn: 'root'
})
export class PlacesService {
// es opcional (?)
  public useLocation?: [number, number];
  //por defecto esta false
  public isLoadingPlaces: boolean = false;
  //arreglo y se inicializa en vacio
  public places: Feature[]=[];

//getter
get isUserLocationReady(): boolean {
  // como sabemos quee esta listo el UserLocationReady, cuando el userLocation este listo
return !!this.useLocation;
}

  constructor( 
    private placesApi:PlacesApiClient,
    private mapService: MapService
  ) {
    //llamemos
this.getUserLocation();
   }


// deberia retornar, una promesa, algo de tipo number
  public async getUserLocation(): Promise<[number, number]> {
   //si tiene async por defecto regresa una promesa
  return new Promise((resolve, reject) => {
    // aca pode,o convertir en una promesa la parte del navigator
    navigator.geolocation.getCurrentPosition(
      //si todo esta correctamente
      //desestructuro el elemento
      //llamo al resolve para resolver la promesa
      ({ coords }) => {
        this.useLocation = [coords.longitude, coords.latitude];
        resolve(this.useLocation);
      },
      ( err ) => {
        alert('No se pudo obtener la geolocalización')
        console.log(err);
        reject();
      }
    );
  });
}
// metodo, que recibe el query de tipo string, que se inicializa en vacio
  getPlacesByQuery(query:string = ''){
//todo: evaluar cuando el query es nulo
    if (query.length===0){
      this.places =[];
      this.isLoadingPlaces = false
      return;
    }

    if ( !this.useLocation ) throw Error('No hay UserLocation');
    //cuando empezamos a buscar se vuelve verdadero
    this.isLoadingPlaces=true

    this.placesApi.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity:this.useLocation.join(',')
      }
    })
    .subscribe( resp =>{
     
      this.isLoadingPlaces=false;
      this.places=resp.features;
//mando el valor( lo que esta entre parentesis)
      this.mapService.createdMarkersFromPlaces( this.places, this.useLocation!)
    });
  }

  //metodo pra ocultar direcciones cuando ya se elije una
  deletePlaces(){
    this.places = [];
  }

}
