import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo(archivo: File, tipo: string, id: string) {
    return new Promise( (resolve, rejects) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      // Imagen: es el nombre del parámetro del servicio con el que se envía el archivo
      formData.append( 'Imagen', archivo, archivo.name );

      // tslint:disable-next-line: only-arrow-functions
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if ( xhr.status === 200 ) {
            resolve( JSON.parse( xhr.response ));
          } else {
            console.log('falló la subida');
            rejects( xhr.response );
          }
        }
      };

      const url = URL_SERVICES + '/upload/' + tipo + '/' + id;

      xhr.open( 'PUT', url, true );
      xhr.send( formData );

    });
  }
}
