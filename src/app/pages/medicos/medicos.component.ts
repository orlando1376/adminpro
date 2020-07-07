import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from 'src/app/services/medico/medico.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _medicoService: MedicoService,
    public _modalUploadService: ModalUploadService

  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this._modalUploadService.notificacion
      .subscribe( () => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;

    this._medicoService.cargarMedicos( this.desde )
    .subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.medicos = resp.medicos;
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
    this.cargarMedicos();
  }

  buscarMedico( valor: string ) {
    // si no se digitó algun valor se cargan todos los médicos
    if ( valor.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this._medicoService.buscarMedicos( valor )
      .subscribe( ( medicos: Medico[]) => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

  borrarMedico( medico: Medico ) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el médico: ' + medico.nombre + ' ' + medico.apellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.value) {
        this._medicoService.borrarMedico( medico._id )
          .subscribe( () => {
            this.cargarMedicos();

            // si está en la última página y se borró el último registro, cargar la página anterior
            if ( this.desde < this.totalRegistros ) {
              this.cambiarDesde(-5);
            }
          });
      }
    });
  }

}
