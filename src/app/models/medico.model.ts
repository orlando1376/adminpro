import { Hospital } from './hospital.model';
export class Medico {

    constructor(
        public nombre?: string,
        public apellido?: string,
        public img?: string,
        public usuario?: string,
        public hospital?: string,
        public _id?: string
    ) { }
}
