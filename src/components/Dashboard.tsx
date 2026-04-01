import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { MusicItem } from "@/types/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ItemForm from "@/components/ItemForm";
import { Music, Plus, Pencil, Trash2, LogOut, Search, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: Props) => {
  const { items, addItem, updateItem, deleteItem } = useInventory();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MusicItem | null>(null);
  const [search, setSearch] = useState("");

  const filtered = items.filter(
    (i) =>
      i.nombre.toLowerCase().includes(search.toLowerCase()) ||
      i.artista.toLowerCase().includes(search.toLowerCase()) ||
      i.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Omit<MusicItem, "id">) => {
    addItem(data);
    setShowForm(false);
  };

  const handleUpdate = (data: Omit<MusicItem, "id">) => {
    if (editing) {
      updateItem(editing.id, data);
      setEditing(null);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.stock, 0);
  const totalValue = items.reduce((sum, i) => sum + i.precio * i.stock, 0);

  return (
    <div id="dashboard" className="min-h-screen bg-background">
      {/* Header */}
      <header id="dashboard-header" className="border-b border-border bg-card sticky top-0 z-10">
        <div id="header-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div id="header-brand" className="flex items-center gap-3">
            <Music className="w-7 h-7 text-primary" />
            <h1 id="header-title" className="text-2xl font-bold text-primary tracking-tight">
              Yandel's Music
            </h1>
          </div>
          <Button id="header-logout" variant="ghost" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      <main id="dashboard-main" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div id="stats-row" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div id="stat-products" className="bg-card border border-border rounded-lg p-5">
            <p id="stat-products-label" className="text-sm text-muted-foreground">Productos</p>
            <p id="stat-products-value" className="text-3xl font-bold text-foreground mt-1">{items.length}</p>
          </div>
          <div id="stat-units" className="bg-card border border-border rounded-lg p-5">
            <p id="stat-units-label" className="text-sm text-muted-foreground">Unidades en stock</p>
            <p id="stat-units-value" className="text-3xl font-bold text-foreground mt-1">{totalItems}</p>
          </div>
          <div id="stat-value" className="bg-card border border-border rounded-lg p-5">
            <p id="stat-value-label" className="text-sm text-muted-foreground">Valor del inventario</p>
            <p id="stat-value-amount" className="text-3xl font-bold text-primary mt-1">
              ${totalValue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div id="toolbar" className="flex flex-col sm:flex-row gap-3 mb-6">
          <div id="toolbar-search" className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search-input"
              placeholder="Buscar por nombre, artista o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button id="toolbar-add" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar producto
          </Button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div id="empty-state" className="text-center py-20">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p id="empty-state-text" className="text-muted-foreground">
              {items.length === 0 ? "No hay productos. ¡Agrega el primero!" : "Sin resultados para tu búsqueda."}
            </p>
          </div>
        ) : (
          <div id="table-wrapper" className="bg-card border border-border rounded-lg overflow-hidden">
            <Table id="inventory-table">
              <TableHeader id="inventory-thead">
                <TableRow id="inventory-header-row" className="border-border hover:bg-transparent">
                  <TableHead id="th-nombre" className="text-muted-foreground">Nombre</TableHead>
                  <TableHead id="th-artista" className="text-muted-foreground">Artista / Marca</TableHead>
                  <TableHead id="th-categoria" className="text-muted-foreground">Categoría</TableHead>
                  <TableHead id="th-precio" className="text-muted-foreground text-right">Precio</TableHead>
                  <TableHead id="th-stock" className="text-muted-foreground text-right">Stock</TableHead>
                  <TableHead id="th-acciones" className="text-muted-foreground text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody id="inventory-tbody">
                {filtered.map((item) => (
                  <TableRow key={item.id} id={`row-${item.id}`} className="border-border">
                    <TableCell id={`cell-nombre-${item.id}`} className="font-medium text-foreground">
                      {item.nombre}
                      {item.descripcion && (
                        <span id={`cell-desc-${item.id}`} className="block text-xs text-muted-foreground mt-0.5">
                          {item.descripcion}
                        </span>
                      )}
                    </TableCell>
                    <TableCell id={`cell-artista-${item.id}`} className="text-secondary-foreground">{item.artista}</TableCell>
                    <TableCell id={`cell-cat-${item.id}`}>
                      <Badge id={`badge-${item.id}`} variant="secondary" className="bg-secondary text-secondary-foreground">
                        {item.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell id={`cell-precio-${item.id}`} className="text-right text-foreground">
                      ${item.precio.toFixed(2)}
                    </TableCell>
                    <TableCell id={`cell-stock-${item.id}`} className="text-right text-foreground">
                      {item.stock}
                    </TableCell>
                    <TableCell id={`cell-actions-${item.id}`} className="text-right">
                      <div id={`actions-${item.id}`} className="flex justify-end gap-1">
                        <Button
                          id={`btn-edit-${item.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditing(item)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          id={`btn-delete-${item.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Add Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent id="dialog-add" className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle id="dialog-add-title" className="text-foreground">Agregar producto</DialogTitle>
          </DialogHeader>
          <ItemForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent id="dialog-edit" className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle id="dialog-edit-title" className="text-foreground">Editar producto</DialogTitle>
          </DialogHeader>
          {editing && (
            <ItemForm
              initialData={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
