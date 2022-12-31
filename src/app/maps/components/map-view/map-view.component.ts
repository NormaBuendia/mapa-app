// import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// import {PlacesService, MapService } from '../../services';
// import { Map, Popup, Marker } from 'mapbox-gl'


// @Component({
//   selector: 'app-map-view',
//   templateUrl: './map-view.component.html',
//   styleUrls: ['./map-view.component.css']
// })
// export class MapViewComponent implements AfterViewInit  {
//    //con el viewChield busque algo que tenga la referencia #mapdiv
//    @ViewChild('mapDiv')
//    mapDivElement!:ElementRef
//   //injectamos el servicio
//   constructor( 
//     private placesService:PlacesService,
//     private mapService:MapService
//      )
//     {}

//  ngAfterViewInit(): void {
// if ( !this.placesService.useLocation) throw Error('No hay placesService.userLocation');

// // INSERTO LA REFERENCIA DE MAPBOX
//   const map = new Map({
//     //le mando el elemto html donde quiero que renderice el map
//     container: this.mapDivElement.nativeElement,
//     style: 'mapbox://styles/mapbox/light-v10', // style URL
//     center: this.placesService.useLocation,
//     zoom: 14,
//   });
 
// //popup
// const popup = new Popup()
// // con esto especificamos un html
// .setHTML(`
// // creamos un string multilinea
//   <h6> Aquí estoy</h6>
//   <span> Estoy en este lugar del mundo</span>
// `);

// //creo el nuevo marcador
// new Marker({ color: 'red'})
// //posicion en la que quiero que este ubicada
// .setLngLat(this.placesService.useLocation)
// //donde se va a colocar el popup
// .setPopup(popup)
// //para enlazarlo con el mapa
// .addTo(map)
// //llamo a setMap
// //se inicializa el mapa se estable en el servicio y ya tenemos acceso global a el
// this.mapService.setMap( map );

//  } 
// }
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Map, Popup, Marker } from 'mapbox-gl';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') 
  mapDivElement!: ElementRef

  constructor( 
    private placesService: PlacesService,
    private mapService: MapService
  ) { }

  ngAfterViewInit(): void {
    if ( !this.placesService.useLocation ) throw Error('No hay placesService.userLocation');
      
    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/light-v10', // style URL
      center: this.placesService.useLocation,
      zoom: 14,
    });

    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);

    new Marker({ color: 'red' })
      .setLngLat( this.placesService.useLocation )
      .setPopup( popup )
      .addTo( map )

    this.mapService.setMap( map );

  }

}