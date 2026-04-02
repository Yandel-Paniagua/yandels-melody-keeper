import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

const ClientForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Client;
  onSubmit: (data: Omit<Client, "id">) => void;
  onCancel: () => void;
}) => {
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [telefono, setTelefono] = useState(initialData?.telefono ?? "");
  const [direccion, setDireccion] = useState(initialData?.direccion ?? "");
  const [notas, setNotas] = useState(initialData?.notas ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, email, telefono, direccion, notas });
  };

  return (
    <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
      <div id="client-nombre-field">
        <label id="client-nombre-label" htmlFor="client-nombre" className="text-sm font-medium text-foreground block mb-1.5">Nombre completo</label>
        <Input id="client-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="bg-input border-border text-foreground" placeholder="Requerido" />
      </div>
      <div id="client-email-field">
        <label id="client-email-label" htmlFor="client-email" className="text-sm font-medium text-foreground block mb-1.5">Email</label>
        <Input id="client-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-input border-border text-foreground" />
      </div>
      <div id="client-telefono-field">
        <label id="client-telefono-label" htmlFor="client-telefono" className="text-sm font-medium text-foreground block mb-1.5">Teléfono</label>
        <Input id="client-telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required className="bg-input border-border text-foreground" placeholder="Requerido" />
      </div>
      <div id="client-direccion-field">
        <label id="client-direccion-label" htmlFor="client-direccion" className="text-sm font-medium text-foreground block mb-1.5">Dirección</label>
        <Input id="client-direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="bg-input border-border text-foreground" />
      </div>
      <div id="client-notas-field">
        <label id="client-notas-label" htmlFor="client-notas" className="text-sm font-medium text-foreground block mb-1.5">Notas</label>
        <Input id="client-notas" value={notas} onChange={(e) => setNotas(e.target.value)} className="bg-input border-border text-foreground" />
      </div>
      <div id="client-form-actions" className="flex gap-3 pt-2">
        <Button id="client-form-submit" type="submit" className="flex-1">{initialData ? "Actualizar" : "Agregar"}</Button>
        <Button id="client-form-cancel" type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
      </div>
    </form>
  );
};

const ClientsView = () => {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.telefono.includes(search)
  );

  const handleAdd = (data: Omit<Client, "id">) => {
    addClient(data);
    setShowForm(false);
  };

  const handleUpdate = (data: Omit<Client, "id">) => {
    if (editing) {
      updateClient(editing.id, data);
      setEditing(null);
    }
  };

  return (
    <div id="clients-view">
      <div id="clients-toolbar" className="flex flex-col sm:flex-row gap-3 mb-6">
        <div id="clients-search-wrapper" className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="clients-search"
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button id="clients-add-btn" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar cliente
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div id="clients-empty" className="text-center py-20">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p id="clients-empty-text" className="text-muted-foreground">
            {clients.length === 0 ? "No hay clientes. ¡Agrega el primero!" : "Sin resultados."}
          </p>
        </div>
      ) : (
        <div id="clients-table-wrapper" className="bg-card border border-border rounded-lg overflow-hidden">
          <Table id="clients-table">
            <TableHeader id="clients-thead">
              <TableRow id="clients-header-row" className="border-border hover:bg-transparent">
                <TableHead id="clients-th-nombre" className="text-muted-foreground">Nombre</TableHead>
                <TableHead id="clients-th-email" className="text-muted-foreground">Email</TableHead>
                <TableHead id="clients-th-telefono" className="text-muted-foreground">Teléfono</TableHead>
                <TableHead id="clients-th-direccion" className="text-muted-foreground">Dirección</TableHead>
                <TableHead id="clients-th-acciones" className="text-muted-foreground text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody id="clients-tbody">
              {filtered.map((client) => (
                <TableRow key={client.id} id={`client-row-${client.id}`} className="border-border">
                  <TableCell id={`client-nombre-${client.id}`} className="font-medium text-foreground">
                    {client.nombre}
                    {client.notas && <span id={`client-notas-${client.id}`} className="block text-xs text-muted-foreground mt-0.5">{client.notas}</span>}
                  </TableCell>
                  <TableCell id={`client-email-${client.id}`} className="text-secondary-foreground">{client.email}</TableCell>
                  <TableCell id={`client-tel-${client.id}`} className="text-secondary-foreground">{client.telefono}</TableCell>
                  <TableCell id={`client-dir-${client.id}`} className="text-secondary-foreground">{client.direccion}</TableCell>
                  <TableCell id={`client-actions-${client.id}`} className="text-right">
                    <div id={`client-btns-${client.id}`} className="flex justify-end gap-1">
                      <Button id={`client-edit-${client.id}`} variant="ghost" size="icon" onClick={() => setEditing(client)} className="text-muted-foreground hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button id={`client-delete-${client.id}`} variant="ghost" size="icon" onClick={() => deleteClient(client.id)} className="text-muted-foreground hover:text-destructive">
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent id="client-dialog-add" className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle id="client-dialog-add-title" className="text-foreground">Agregar cliente</DialogTitle>
          </DialogHeader>
          <ClientForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent id="client-dialog-edit" className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle id="client-dialog-edit-title" className="text-foreground">Editar cliente</DialogTitle>
          </DialogHeader>
          {editing && <ClientForm initialData={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsView;
