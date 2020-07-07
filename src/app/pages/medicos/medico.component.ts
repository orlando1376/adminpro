import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService } from '../../services/medico/medico.service';
import { HospitalService } from '../../services/service.index';
import { Medico } from 'src/app/models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public router: Router,
    public activatedRote: ActivatedRoute,
    public _modalUploadService: ModalUploadService
  ) {
    activatedRote.params.subscribe( params => {
      const id = params.id;

      if ( id !== 'nuevo' ) {
        this.obtenerMedico( id );
      }
    });
  }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
      .subscribe( (resp: any) => this.hospitales = resp.hospitales );

    this._modalUploadService.notificacion
      .subscribe( resp => {
        this.medico.img = resp.medico.img;
      });
  }

  obtenerMedico( id: string ) {
    this._medicoService.obtenerMedico( id )
      .subscribe( medico => {
        this.medico = medico;
        this.medico.hospital = medico.hospital._id;
        this.changeHospital( this.medico.hospital );
      });
  }

  guardarMedico( f: NgForm ) {
    this._medicoService.guardarMedico( this.medico )
      .subscribe( medico => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', medico._id]);
      });
  }

  changeHospital( id: string ) {
    this._hospitalService.obtenerHospital( id )
     .subscribe( hospital => this.hospital = hospital );
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal( 'medicos', this.medico._id );
  }

}
