import { Factura } from "../facturas/models/factura";
import { Region } from "./region";

export class Cliente {
    id:number;
    nombre:string;
    apellido:string;
    createAt:string;
    email:string;
    foto:string;
    region: Region;
    //Formas de definir un array
    //facturas: Factura[] = [];
    facturas: Array<Factura> = [];

}
