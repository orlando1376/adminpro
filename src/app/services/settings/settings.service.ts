import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class SettingsService {
  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };

  constructor( @Inject(DOCUMENT) private _document ) {
    this.cargarAjustes();
  }

  guardarAjustes() {
    localStorage.setItem( 'ajustes', JSON.stringify(this.ajustes) );
  }

  cargarAjustes() {
    if ( localStorage.getItem('ajustes') ) {
      this.ajustes = JSON.parse( localStorage.getItem( 'ajustes' ));
      this.aplicarTema( this.ajustes.tema );
    } else {
      // cargar tema por defecto
      this.aplicarTema( this.ajustes.tema );
    }
  }

  aplicarTema( tema: string ) {
    const url = `assets/css/colors/${tema}.css`;
    this._document.getElementById('tema').setAttribute('href', url);

    this.ajustes.temaUrl = url;
    this.ajustes.tema = tema;
    this.guardarAjustes();
  }
}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
