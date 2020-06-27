import { Component, OnInit } from '@angular/core';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {
    this.contarTres()
    .then( mensaje => console.log('Terminó. ', mensaje ))
    .catch( error => console.log('Error en la promesa', error ));
  }

  ngOnInit(): void {
  }

  contarTres(): Promise<boolean> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise( (resolve, reject) => {
      let contador = 0;

      const intervale = setInterval( () => {
        contador += 1;
        console.log(contador);

        if ( contador === 3 ) {
          resolve(true);
          // reject('Error...');
          clearInterval( intervale );
        }
      }, 1000) ;
    });
  }
}
