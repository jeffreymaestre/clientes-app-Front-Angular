import { Producto } from "./producto";

export class ItemFactura {
    producto: Producto;
    cantidad: number = 1;
    importe: number;
}
