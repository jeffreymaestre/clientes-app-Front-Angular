import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map, mergeMap, startWith} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent {

  titulo:string = 'Nueva Factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl('');
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private facturaService: FacturaService, private router: Router){}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });
   
    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : null),
      mergeMap(value => value ? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined{
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteActivatedEvent) : void{
    let producto = event.option.value as Producto;
    console.log(producto);

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {

      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);

    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id:number, event:any): void {
    let cantidad:number = event.target.value as number;

    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id:number):boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id:number):void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  create(facturaForm):void{
    console.log(this.factura)

    if (this.factura.items.length == 0) {
      this.autocompleteControl.setErrors({'invalid': true});
    }

    if (facturaForm.form.valid && this.factura.items.length > 0) {
  
      this.facturaService.create(this.factura).subscribe(factura => {
        Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con éxito`, 'success');
        this.router.navigate(['/facturas', factura.id]);
      });

      }

  }

}
