export interface Client {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  notas: string;
}

export interface Review {
  id: string;
  clienteNombre: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export interface Shipment {
  id: string;
  productoNombre: string;
  clienteNombre: string;
  direccion: string;
  telefono: string;
  fechaEnvio: string;
  notas: string;
  estado: "Pendiente" | "Enviado" | "Entregado";
}
