import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer?:NodeJS.Timeout;

  constructor(
    private placesService:PlacesService
  ){}
//cada vez que recibamos un nuevo valor de query que cambio podemos verificar las teclas que cambio
  onQueryChanged(query:string = '' ){
   // si el debounceTimer si se tira un valor, lo limpio con clearTimeOut
    if ( this.debounceTimer) clearTimeout(this.debounceTimer);
  
    
    this.debounceTimer = setTimeout(() => {
      //cuando ya pasa los 350 segundo
      this.placesService.getPlacesByQuery(query);
      
      //despues de 1 segundo se escribe en consola el mensaje
      //console.log('Mandar este query:', query);
    }, 350);
  }

}
