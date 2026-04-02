import { useState } from "react";
import { MusicItem } from "@/types/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIAS: MusicItem["categoria"][] = [
  "Vinilo",
  "CD",
  "Cassette",
  "Instrumento",
  "Accesorio",
];

interface Props {
  initialData?: MusicItem;
  onSubmit: (data: Omit<MusicItem, "id">) => void;
  onCancel: () => void;
}

const ItemForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [artista, setArtista] = useState(initialData?.artista ?? "");
  const [categoria, setCategoria] = useState<MusicItem["categoria"]>(
    initialData?.categoria ?? "CD"
  );
  const [precio, setPrecio] = useState(initialData?.precio?.toString() ?? "");
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? "");
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nombre,
      artista,
      categoria,
      precio: parseFloat(precio) || 0,
      stock: parseInt(stock) || 0,
      descripcion,
    });
  };

  return (
    <form id="item-form" onSubmit={handleSubmit} className="space-y-4">
      <div id="form-nombre-field">
        <label id="form-nombre-label" htmlFor="form-nombre" className="text-sm font-medium text-foreground block mb-1.5">
          Nombre
        </label>
        <Input id="form-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="bg-input border-border text-foreground" />
      </div>
      <div id="form-artista-field">
        <label id="form-artista-label" htmlFor="form-artista" className="text-sm font-medium text-foreground block mb-1.5">
          Artista / Marca
        </label>
        <Input id="form-artista" value={artista} onChange={(e) => setArtista(e.target.value)} required className="bg-input border-border text-foreground" />
      </div>
      <div id="form-categoria-field">
        <label id="form-categoria-label" className="text-sm font-medium text-foreground block mb-1.5">
          Categoría
        </label>
        <Select value={categoria} onValueChange={(v) => setCategoria(v as MusicItem["categoria"])}>
          <SelectTrigger id="form-categoria" className="bg-input border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent id="form-categoria-options">
            {CATEGORIAS.map((c) => (
              <SelectItem key={c} value={c} id={`form-cat-${c.toLowerCase()}`}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div id="form-row-precio-stock" className="grid grid-cols-2 gap-4">
        <div id="form-precio-field">
          <label id="form-precio-label" htmlFor="form-precio" className="text-sm font-medium text-foreground block mb-1.5">
            Precio ($)
          </label>
          <Input id="form-precio" type="number" step="0.01" min="20000" max="750000" value={precio} onChange={(e) => setPrecio(e.target.value)} required className="bg-input border-border text-foreground" placeholder="20,000 - 750,000" />
        </div>
        <div id="form-stock-field">
          <label id="form-stock-label" htmlFor="form-stock" className="text-sm font-medium text-foreground block mb-1.5">
            Stock
          </label>
          <Input id="form-stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="bg-input border-border text-foreground" />
        </div>
      </div>
      <div id="form-descripcion-field">
        <label id="form-descripcion-label" htmlFor="form-descripcion" className="text-sm font-medium text-foreground block mb-1.5">
          Descripción
        </label>
        <Input id="form-descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="bg-input border-border text-foreground" />
      </div>
      <div id="form-actions" className="flex gap-3 pt-2">
        <Button id="form-submit" type="submit" className="flex-1">
          {initialData ? "Actualizar" : "Agregar"}
        </Button>
        <Button id="form-cancel" type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
