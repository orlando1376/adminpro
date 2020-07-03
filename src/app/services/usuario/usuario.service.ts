import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient} from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import 'rxjs/add/operator/map';
// import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router
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
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.token = '';
    this.usuario = null;
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICES + '/login/google';

    return this.http.post( url, {token} )
      .map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);

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
        this.guardarStorage(resp.id, resp.token, resp.usuario);

        return true;
      });
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICES + '/usuario';

    return this.http.post( url, usuario )
      .map( (resp: any) => {
        Swal.fire({title: 'Usuario creado', text: usuario.email, icon: 'success'});
        return resp.usuario;
      });
  }
}
