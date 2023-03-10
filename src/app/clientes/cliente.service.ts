import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private router: Router) { }

  /*private agregarAuthorizationHeader(){
    let httpHeaders = new HttpHeaders();
    
    let token = this.authService.token;
    if (token != null) {
      return httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return httpHeaders = httpHeaders;
  }*/

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones')
  }

  getClientes(page: number): Observable<any> { 
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map( (response:any) => {

        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es-CO');
          return cliente;
        });
        return response;
      })
    );
  }

  //TODO: forma automatica de convertir la respuesta que obtenemos desde el backend
  /*create(cliente: Cliente) : Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }*/

  //TODO: forma manual (explicita) de convertir la respuesta que obtenemos desde el backend
  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    )
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status != 401 && e.error.mensaje) {
          
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
       
        return throwError(e);
    }))
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
       

        if(e.status==400){
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
       
        return throwError(e);
      })
    )
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
       
        return throwError(e);
      })
    )
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true     
    });

    return this.http.request(req)
  }
}
