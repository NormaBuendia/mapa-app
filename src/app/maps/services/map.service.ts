import { Injectable } from '@angular/core';
import { LngLatLike, Map, Marker, Popup, LngLatBounds, AnySourceData } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  //creamos propiedades
  //puede que exista o que sea undefined
  //private map:Map | undefined;
  private map?:Map 

// creo el marcador para los lugares que busco
// markers de tipo Markers y lo inicializo vacio
  private markers:Marker[]=[]

  //getter
  //si tiene algun valor esto va aser un true, sino va aser un false
  get isMapReady() {
    return !!this.map
  }

  //creo el constructor, injecto la api
  constructor( private directionsApi:DirectionsApiClient ){}

// establecer un valor de map
//un metodo setMap, que recibe un map de tipo Map
setMap( map: Map){
  // this.map es igual al map que tengo ahi como parametro
 this.map = map;
}
//mover el mapa a otro lado de la pantalla
//LngLatLike, es un objeto que tiene longitud y latitud
flyTo( coords: LngLatLike ) {
  if ( !this.isMapReady ) throw Error('El mapa no esta inicializado');

  this.map?.flyTo({
    zoom: 14,
    center: coords
  });
}

// metodo para colocar los markers, que ocupa places que es un arreglo de Features
createdMarkersFromPlaces( places:Feature[], userLocation: [number, number]){
  if ( !this.map) throw Error('Mapa no inicializado');

  this.markers.forEach( marker => marker.remove());
  // almaceno los nuevos marcadores
  const newMarkers = [];
  // recoorro con un for
  for (const place of places) {
    //extraigo la latitud y la longitud
    const [ lng, lat] = place.center;
    //creo la variables
    const popup = new Popup()
    .setHTML( `
      <h6>${ place.text}</h6>
      <span>${ place.place_name}</span>
    `);
    //se crea el marcador
    const newMarker = new Marker()
      .setLngLat([lng,lat])
      .setPopup(popup)
      .addTo( this.map);

    newMarkers.push( newMarker);

  }
  this.markers= newMarkers;

 //si no hay marcadores no haga nada
 if( places.length === 0) return;
  //limites del mapa
  const bounds = new LngLatBounds()
    // en la posicion cero
    //this.markers[0].getLngLat(),
    //this.markers[0].getLngLat(),
    

    //se recorre uno por uno los marker y se le da la latitud y longitud(al obheto bounds) para que se ve en el mapa con extend
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat() ) );
    //los bounds se xtiende con el userlocation
    bounds.extend(userLocation);

  
  //anadimos todos los markers en la vista del mapa
  //dentro del extend anadimos cada uno de los valores
  //  bounds.extend()
  //para que cuando aparescan los markadores se coloque la pantalla centrada con todas 
  //las apariciones... 
  // se puede anadir un padding al mapa que muestra las direcciones, con 
  this.map.fitBounds(bounds, {
    padding:200
  })
}

//creo el metodo
getRouteBetweenPoints( start: [ number, number], end:[ number, number]){
// llamo al directionApi y traigo a la interface creada con el modelo
this.directionsApi.get<DirectionsResponse>(`/${start.join('%2C')}%3B${end.join('%2C')}`)
//hasta que no se suscriba alguine no se va  arealizar la peticion
.subscribe(resp => this.drawPolyline(resp.routes[0]) );
}
//propiedad que recibe una route de tipo Route, que viene de la interfaz
private drawPolyline ( route:Route) {
  console.log({
    kms: route.distance/1000,
    duration: route.duration/60
  });

  if( !this.map) throw Error('Mapa no inicializado');
  // creamos las constantes con todas las coordenadas
  const coords = route.geometry.coordinates;
  const bounds = new LngLatBounds();

  //recorremos las coordenadas, 
coords.forEach( ([lng, lat])=> {
   bounds.extend([lng, lat])
});

  //para que coloque los bounds... trazado de ruta
  this.map?.fitBounds(bounds, {
    padding:200
  });

  //polyline imprimir el trazado de un punto a otro
  //se crea un objeto
  const sourceData: AnySourceData = {
    type: 'geojson',
    //se define la data
    data:{
      type:'FeatureCollection',
      //features es un arreglo
      features:[
          {
        type:'Feature',
        properties:{},
        geometry:{
          type: 'LineString',
          coordinates:coords
        }
      }
      ]

    }
  }

  //todo: limpiar ruta previa
 // para borrar el primer trazado y poder hacer otro
 //si tiene un layer llamado RouteString
 if( this.map.getLayer('RouteString')) {
  // que remueva el layer
  this.map.removeLayer('RouteString');
  //y remueva la fuente
  this.map.removeSource('RouteString')
 }

  this.map.addSource('RouteString', sourceData);
  this.map.addLayer({
    id:'RouteString',
    type:'line',
    source:'RouteString',
    layout:{
      //bordes redondeados
      'line-cap':'round',
      'line-join':'round'
    },
    paint:{
      'line-color':'red',
      'line-width':3
    }
  });
}

}
