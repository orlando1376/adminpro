import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { Subscriber } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
      .subscribe( resp => this.cargarUsuarios() );
  }

  mostrarModal( id: string ) {
    this._modalUploadService.mostrarModal( 'usuarios', id );
  }

  cargarUsuarios() {
    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
    .subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( valor: string ) {
    // si no se digitó algun valor se cargan todos los usuarios
    if ( valor.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios( valor )
      .subscribe( (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this._usuarioService.usuario._id ) {
      Swal.fire({title: 'No se puede borrar usuario', text: 'No se puede borrar a si mismo', icon: 'error'});
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de borrara a: ' + usuario.nombre + ' ' + usuario.apellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.value) {
        this._usuarioService.borrarUsuario( usuario._id )
          .subscribe( () => {
            this.cargarUsuarios();

            // si está en la última página y se borró el último registro, cargar la página anterior
            if ( this.desde < this.totalRegistros ) {
              this.cambiarDesde(-5);
            }
          });
      }
    });
  }

  guardarUsuario( usuario: Usuario ) {
    this._usuarioService.actualizarUsuario( usuario )
      .subscribe();
  }

}
