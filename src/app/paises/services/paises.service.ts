import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.com/v3.1'
  private _continentes : string[] = [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get continentes():string[] {
    return [...this._continentes]
  }

  constructor( private  http: HttpClient) { }


  getPaisesPorRegion ( region: string ): Observable<PaisSmall[]> {

    const url: string = `${ this.baseUrl}/region/${region}?fields=name,cca3`
    return this.http.get<PaisSmall[]>(url);
  }


  getPaisPorCodigo( codigo: string):Observable<Pais | null> {

    if( !codigo ) { return of(null) }   //En caso de que no se encuentre un pais con ese codigo, emita un null

    const url = `${ this.baseUrl }/alpha/${ codigo }?fields=borders`;
    return this.http.get<Pais>( url );
  }


} 
