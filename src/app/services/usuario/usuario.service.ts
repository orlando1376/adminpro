import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient} from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import { Observable } from 'rxjs/Observable';
import {from, Observable, empty, throwError} from 'rxjs';
// import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.token = '';
    this.usuario = null;
    this.menu = [];
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICES + '/login/google';

    return this.http.post( url, {token} )
      .map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      });
  }

  login( usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICES + '/login';

    return this.http.post( url, usuario )
      .map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      })
      .catch ( err => {
        Swal.fire({title: 'Error en el login', text: err.error.mensaje, icon: 'error'});
        return throwError(err);
      });
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICES + '/usuario';

    return this.http.post( url, usuario )
      .map( (resp: any) => {
        Swal.fire({title: 'Usuario creado', text: usuario.nombre + ' ' + usuario.apellido, icon: 'success'});
        return resp.usuario;
      })
      .catch ( err => {
        Swal.fire({title: err.error.mensaje, text: err.error.errors.message, icon: 'error'});
        return throwError(err);
      });
  }

  actualizarUsuario(usuario: Usuario) {
    const url = URL_SERVICES + '/usuario/' + usuario._id + '?token=' + this.token;

    return this.http.put( url, usuario )
      .map( (resp: any) => {
        // si el usuario a actualizar es el mismo que está logueado
        if ( usuario._id === this.usuario._id) {
          this.guardarStorage(resp.usuario._id, this.token, resp.usuario, this.menu);
        }

        Swal.fire({title: 'Usuario actualizado', text: usuario.nombre + ' ' + usuario.apellido, icon: 'success'});
        return true;
      })
      .catch ( err => {
        Swal.fire({title: err.error.mensaje, text: err.error.errors.message, icon: 'error'});
        return throwError(err);
      });
  }

  cambiarImagen( archivo: File, id: string ) {
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
      .then( (resp: any) => {
        this.usuario.img = resp.usuario.img;
        this.guardarStorage(id, this.token, resp.usuario, this.menu);
        Swal.fire({title: 'Imagen actualizada', text: this.usuario.nombre + ' ' + this.usuario.apellido, icon: 'success'});
      })
      .catch( resp => {
        Swal.fire({title: 'Error al actualizar imagen', text: resp.mensaje, icon: 'success'});
      });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = URL_SERVICES + '/usuario?desde=' + desde;
    return this.http.get( url );
  }

  buscarUsuarios( valor: string ) {
    const url = URL_SERVICES + '/busqueda/coleccion/usuarios/' + valor;
    return this.http.get( url )
      .map( (resp: any) => resp.usuarios );
  }

  borrarUsuario( id: string ) {
    const url = URL_SERVICES + '/usuario/' + id + '?token=' + this.token;
    return this.http.delete( url )
      .map( resp => {
        Swal.fire({title: 'Usuario borrado', text: 'El usuario a sido borrado correctamente.', icon: 'success'});
        return true;
      });
  }

}
