import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Factura } from './models/factura';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent {

  factura:Factura;
  titulo:string = 'Factura';

  constructor(private facturaService: FacturaService, private activateRoute: ActivatedRoute){}

  ngOnInit(){
    this.activateRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      this.facturaService.getFactura(id).subscribe(factura => this.factura = factura)
    })
    }
  }
