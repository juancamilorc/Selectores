import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ['']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    continente: ['', Validators.required ],
    pais: ['', Validators.required ],
    frontera: ['', Validators.required ],
  })

  //Llenar selectores
  continentes: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  //UI
  cargando: boolean = false;

  constructor( private fb: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.continentes = this.paisesService.continentes;

    //Cambie el continente
    // this.miFormulario.get('continente')?.valueChanges
    // .subscribe( continente => {
    //   console.log(continente);

    //   this.paisesService.getPaisesPorRegion( continente ) 
    //     .subscribe( paises => {
    //       console.log(paises);
    //       this.paises = paises;
    //       console.log(this.paises);
    //     })
    // } )

    //Cuando cambio la region
      this.miFormulario.get('continente')?.valueChanges
      .pipe(
        tap( ( _ ) => { //El _ para decir no me importa que venga, lo unico que quiero es hacer la instruccion de abajo sin importar que me traiga 
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( continente => this.paisesService.getPaisesPorRegion( continente ) )
      )
      .subscribe ( paises => {
       this.paises = paises;
       this.cargando = false;
      });

      //Cuando cambia el pais
      this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(( ) => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) )
      )
      .subscribe ( pais => {
      this.fronteras = pais?.borders || [];  
      this.cargando = false;
      })
    }


  guardar(){
    console.log(this.miFormulario.value);
  }
}
