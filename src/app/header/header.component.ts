import { Component } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../usuarios/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent{
title: string = 'App angular'

constructor(public authService:AuthService, private router: Router){}

logout():void{
    let username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${username}, has cerrado sesion con éxito!`, 'success');
    this.router.navigate(['/login']);
}
}