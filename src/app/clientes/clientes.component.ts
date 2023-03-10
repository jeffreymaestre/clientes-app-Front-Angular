import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService : ClienteService, private activateRoute: ActivatedRoute, private modalService: ModalService, public authService: AuthService){}

  ngOnInit(): void {
    
    this.activateRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
        response => { 
          this.clientes = response.content as Cliente[],
          this.paginador = response;
        });
    });
    
    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    });
    
  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: 'Esta seguro?',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Eliminado!',
              `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con éxito`,
              'success'

              )
          }
        )
      }
    })
  }

  abrirModal(cliente:  Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
