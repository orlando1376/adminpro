import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService

  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this._modalUploadService.notificacion
      .subscribe( () => this.cargarHospitales() );
  }

  actualizarImagen( id: string ) {
    this._modalUploadService.mostrarModal( 'hospitales', id );
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalService.cargarHospitales( this.desde )
    .subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
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
    this.cargarHospitales();
  }

  buscarHospital( valor: string ) {
    // si no se digitó algun valor se cargan todos los hospitales
    if ( valor.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospitales( valor )
      .subscribe( ( hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  borrarHospital( hospital: Hospital ) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el hospital: ' + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.value) {
        this._hospitalService.borrarHospital( hospital._id )
          .subscribe( () => {
            this.cargarHospitales();

            // si está en la última página y se borró el último registro, cargar la página anterior
            if ( this.desde < this.totalRegistros ) {
              this.cambiarDesde(-5);
            }
          });
      }
    });
  }

  crearHospital() {
    Swal.fire({
      title: 'Nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Necesita digitar un nombre';
        }
      }
    }).then((result) => {
      if (result.value) {
        this._hospitalService.crearHospital( String(result.value) )
          .subscribe( () => this.cargarHospitales() );
      }
    });
  }

  guardarHospital( hospital: Hospital ) {
    this._hospitalService.actualizarHospital( hospital )
      .subscribe();
  }

}
