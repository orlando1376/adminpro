import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable()
    .pipe(
      // retry(2) // reintentar 2 veces
    )
    .subscribe(
      numero => console.log('Subs ', numero),
      error => console.error('Error: ', error),
      () => console.log('El observador termonó')
    );
   }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observable: Subscriber<any>) => {
      let contador = 0;
      const intervalo = setInterval( () => {
        contador ++;

        const salida = {
          valor: contador
        };

        observable.next( salida );

        // if ( contador === 3) {
        //   clearInterval( intervalo );
        //   observable.complete();
        // }

        // if ( contador === 2 ) {
        //   // clearInterval( intervalo );
        //   observable.error('Auxilio');
        // }

      }, 500);
    }).pipe(
      map( resp => resp.valor ), // transformar respuesta
      filter( ( valor, index ) => {
        // filtar solo números pares
        if ( (valor % 2) === 1 ) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
      })
    );
  }

}
