import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  forma: FormGroup;

  constructor(
    public _usuarioService: UsuarioService
  ) { }

  sonIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      } else {
        return {sonIguales: true};
      }
    };
  }

  ngOnInit(): void {
    init_plugins();
    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      apellido: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, {validators: this.sonIguales('password', 'password2')});

    this.forma.setValue({
      nombre: 'Test1',
      apellido: 'Test1',
      email: 'test1@gmail.com',
      password: '123456',
      password2: '123456',
      condiciones: true
    });

  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return;
    }
    if (!this.forma.value.condiciones) {
      Swal.fire({title: 'Importante', text: 'Debe aceptar las condiciones', icon: 'warning'});
      return;
    }

    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.apellido,
      this.forma.value.email,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario( usuario )
      .subscribe( resp => {
        console.log(resp);
      });
  }
}
