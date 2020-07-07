import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) {}

  cargarMedicos( desde: number = 0 ) {
    const url = URL_SERVICES + '/medico?desde=' + desde;
    return this.http.get( url );
  }

  obtenerMedico( id: string ) {
    const url = URL_SERVICES + '/medico/' + id;
    return this.http.get( url )
      .map( (resp: any) =>  resp.medico );
  }

  borrarMedico( id: string ) {
    const url = URL_SERVICES + '/medico/' + id + '?token=' + this._usuarioService.token;
    return this.http.delete( url )
      .map( resp => {
        Swal.fire({title: 'Médico borrado', text: 'El médico a sido borrado correctamente.', icon: 'success'});
        return true;
      });
  }

  crearMedico(nombre: string) {
    const url = URL_SERVICES + '/medico' + '?token=' + this._usuarioService.token;

    return this.http.post( url, {nombre} )
      .map( (resp: any) => {
        Swal.fire({title: 'Médico creado', text: nombre, icon: 'success'});
        return resp.medico;
      });
  }

  buscarMedicos( valor: string ) {
    const url = URL_SERVICES + '/busqueda/coleccion/medicos/' + valor;
    return this.http.get( url )
      .map( (resp: any) => resp.medicos );
  }

  actualizarMedico(medico: Medico) {
    const url = URL_SERVICES + '/medico/' + medico._id + '?token=' + this._usuarioService.token;

    return this.http.put( url, medico )
      .map( (resp: any) => {
        Swal.fire({title: 'Médico actualizado', text: medico.nombre + ' ' + medico.apellido, icon: 'success'});
        return true;
      });
  }

  guardarMedico( medico: Medico ) {
    let url = URL_SERVICES + '/medico/';

    if ( medico._id ) {
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico )
        .map( (resp: any) => {
          Swal.fire({title: 'Médico actualizado', text: medico.nombre + ' ' + medico.apellido, icon: 'success'});
          return resp.medico;
        });
    } else {
      url += '?token=' + this._usuarioService.token;

      return this.http.post( url, medico )
        .map( (resp: any) => {
          Swal.fire({title: 'Médico creado', text: medico.nombre + ' ' + medico.apellido, icon: 'success'});
          return resp.medico;
        });
    }
  }

}
