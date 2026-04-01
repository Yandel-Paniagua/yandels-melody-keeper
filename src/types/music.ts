export interface MusicItem {
  id: string;
  nombre: string;
  artista: string;
  categoria: "Vinilo" | "CD" | "Cassette" | "Instrumento" | "Accesorio";
  precio: number;
  stock: number;
  descripcion: string;
}
