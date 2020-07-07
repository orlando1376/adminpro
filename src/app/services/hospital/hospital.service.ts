import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Hospital } from '../../models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) {}

  cargarHospitales( desde: number = 0 ) {
    const url = URL_SERVICES + '/hospital?desde=' + desde;
    return this.http.get( url );
  }

  obtenerHospital( id: string ) {
    const url = URL_SERVICES + '/hospital/' + id;
    return this.http.get( url )
      .map( (resp: any) =>  resp.hospital );
  }

  borrarHospital( id: string ) {
    const url = URL_SERVICES + '/hospital/' + id + '?token=' + this._usuarioService.token;
    return this.http.delete( url )
      .map( resp => {
        Swal.fire({title: 'Hospital borrado', text: 'El hospital a sido borrado correctamente.', icon: 'success'});
        return true;
      });
  }

  crearHospital(nombre: string) {
    const url = URL_SERVICES + '/hospital' + '?token=' + this._usuarioService.token;

    return this.http.post( url, {nombre} )
      .map( (resp: any) => {
        Swal.fire({title: 'Hospital creado', text: nombre, icon: 'success'});
        return resp.hospital;
      });
  }

  buscarHospitales( valor: string ) {
    const url = URL_SERVICES + '/busqueda/coleccion/hospitales/' + valor;
    return this.http.get( url )
      .map( (resp: any) => resp.hospitales );
  }

  actualizarHospital(hospital: Hospital) {
    const url = URL_SERVICES + '/hospital/' + hospital._id + '?token=' + this._usuarioService.token;

    return this.http.put( url, hospital )
      .map( (resp: any) => {
        Swal.fire({title: 'Hospital actualizado', text: hospital.nombre, icon: 'success'});
        return true;
      });
  }

}
