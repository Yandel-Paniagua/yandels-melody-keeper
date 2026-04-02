import { useState } from "react";
import { useShipments } from "@/hooks/useShipments";
import { Shipment } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Pencil, Truck, CalendarIcon } from "lucide-react";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
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

const ESTADOS: Shipment["estado"][] = ["Pendiente", "Enviado", "Entregado"];

const ShipmentForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Shipment;
  onSubmit: (data: Omit<Shipment, "id">) => void;
  onCancel: () => void;
}) => {
  const [productoNombre, setProductoNombre] = useState(initialData?.productoNombre ?? "");
  const [clienteNombre, setClienteNombre] = useState(initialData?.clienteNombre ?? "");
  const [direccion, setDireccion] = useState(initialData?.direccion ?? "");
  const [telefono, setTelefono] = useState(initialData?.telefono ?? "");
  const [fechaEnvio, setFechaEnvio] = useState<Date | undefined>(
    initialData?.fechaEnvio ? new Date(initialData.fechaEnvio) : undefined
  );
  const [notas, setNotas] = useState(initialData?.notas ?? "");
  const [estado, setEstado] = useState<Shipment["estado"]>(initialData?.estado ?? "Pendiente");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      productoNombre,
      clienteNombre,
      direccion,
      telefono,
      fechaEnvio: fechaEnvio ? fechaEnvio.toISOString().split("T")[0] : "",
      notas,
      estado,
    });
  };

  return (
    <form id="shipment-form" onSubmit={handleSubmit} className="space-y-4">
      <div id="shipment-producto-field">
        <label id="shipment-producto-label" htmlFor="shipment-producto" className="text-sm font-medium text-foreground block mb-1.5">Instrumento / Producto</label>
        <Input id="shipment-producto" value={productoNombre} onChange={(e) => setProductoNombre(e.target.value)} required className="bg-input border-border text-foreground" />
      </div>
      <div id="shipment-cliente-field">
        <label id="shipment-cliente-label" htmlFor="shipment-cliente" className="text-sm font-medium text-foreground block mb-1.5">Nombre del cliente</label>
        <Input id="shipment-cliente" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} required className="bg-input border-border text-foreground" />
      </div>
      <div id="shipment-direccion-field">
        <label id="shipment-direccion-label" htmlFor="shipment-direccion" className="text-sm font-medium text-foreground block mb-1.5">Dirección de envío</label>
        <Input id="shipment-direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required className="bg-input border-border text-foreground" />
      </div>
      <div id="shipment-row" className="grid grid-cols-2 gap-4">
        <div id="shipment-telefono-field">
          <label id="shipment-telefono-label" htmlFor="shipment-telefono" className="text-sm font-medium text-foreground block mb-1.5">Teléfono</label>
          <Input id="shipment-telefono" value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))} required className="bg-input border-border text-foreground" placeholder="Solo números" />
        </div>
        <div id="shipment-estado-field">
          <label id="shipment-estado-label" className="text-sm font-medium text-foreground block mb-1.5">Estado</label>
          <Select value={estado} onValueChange={(v) => setEstado(v as Shipment["estado"])}>
            <SelectTrigger id="shipment-estado" className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent id="shipment-estado-options">
              {ESTADOS.map((e) => (
                <SelectItem key={e} value={e} id={`shipment-estado-${e.toLowerCase()}`}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div id="shipment-fecha-field">
        <label id="shipment-fecha-label" className="text-sm font-medium text-foreground block mb-1.5">Fecha de envío</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="shipment-fecha-btn"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-input border-border",
                !fechaEnvio && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fechaEnvio ? format(fechaEnvio, "PPP", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent id="shipment-calendar-popover" className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fechaEnvio}
              onSelect={setFechaEnvio}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div id="shipment-notas-field">
        <label id="shipment-notas-label" htmlFor="shipment-notas" className="text-sm font-medium text-foreground block mb-1.5">Notas adicionales</label>
        <Textarea id="shipment-notas" value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} placeholder="Instrucciones especiales..." className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
      </div>
      <div id="shipment-form-actions" className="flex gap-3 pt-2">
        <Button id="shipment-form-submit" type="submit" className="flex-1">{initialData ? "Actualizar" : "Registrar envío"}</Button>
        <Button id="shipment-form-cancel" type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
      </div>
    </form>
  );
};

const estadoColor = (estado: Shipment["estado"]) => {
  switch (estado) {
    case "Pendiente": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Enviado": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Entregado": return "bg-green-500/20 text-green-400 border-green-500/30";
  }
};

const ShippingView = () => {
  const { shipments, addShipment, updateShipment, deleteShipment } = useShipments();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Shipment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (data: Omit<Shipment, "id">) => {
    addShipment(data);
    setShowForm(false);
  };

  const handleUpdate = (data: Omit<Shipment, "id">) => {
    if (editing) {
      updateShipment(editing.id, data);
      setEditing(null);
    }
  };

  return (
    <div id="shipping-view">
      <div id="shipping-toolbar" className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        <p id="shipping-count" className="text-muted-foreground text-sm flex-1">
          {shipments.length} envío{shipments.length !== 1 ? "s" : ""} registrado{shipments.length !== 1 ? "s" : ""}
        </p>
        <Button id="shipping-add-btn" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo envío
        </Button>
      </div>

      {shipments.length === 0 ? (
        <div id="shipping-empty" className="text-center py-20">
          <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p id="shipping-empty-text" className="text-muted-foreground">No hay envíos registrados.</p>
        </div>
      ) : (
        <div id="shipping-table-wrapper" className="bg-card border border-border rounded-lg overflow-hidden">
          <Table id="shipping-table">
            <TableHeader id="shipping-thead">
              <TableRow id="shipping-header-row" className="border-border hover:bg-transparent">
                <TableHead id="shipping-th-producto" className="text-muted-foreground">Producto</TableHead>
                <TableHead id="shipping-th-cliente" className="text-muted-foreground">Cliente</TableHead>
                <TableHead id="shipping-th-direccion" className="text-muted-foreground">Dirección</TableHead>
                <TableHead id="shipping-th-telefono" className="text-muted-foreground">Teléfono</TableHead>
                <TableHead id="shipping-th-fecha" className="text-muted-foreground">Fecha</TableHead>
                <TableHead id="shipping-th-estado" className="text-muted-foreground">Estado</TableHead>
                <TableHead id="shipping-th-acciones" className="text-muted-foreground text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody id="shipping-tbody">
              {shipments.map((s) => (
                <TableRow key={s.id} id={`shipment-row-${s.id}`} className="border-border">
                  <TableCell id={`shipment-prod-${s.id}`} className="font-medium text-foreground">{s.productoNombre}</TableCell>
                  <TableCell id={`shipment-cli-${s.id}`} className="text-secondary-foreground">{s.clienteNombre}</TableCell>
                  <TableCell id={`shipment-dir-${s.id}`} className="text-secondary-foreground text-sm">{s.direccion}</TableCell>
                  <TableCell id={`shipment-tel-${s.id}`} className="text-secondary-foreground">{s.telefono}</TableCell>
                  <TableCell id={`shipment-fecha-${s.id}`} className="text-secondary-foreground">{s.fechaEnvio}</TableCell>
                  <TableCell id={`shipment-estado-${s.id}`}>
                    <Badge id={`shipment-badge-${s.id}`} variant="outline" className={estadoColor(s.estado)}>{s.estado}</Badge>
                  </TableCell>
                  <TableCell id={`shipment-actions-${s.id}`} className="text-right">
                    <div id={`shipment-btns-${s.id}`} className="flex justify-end gap-1">
                      <Button id={`shipment-edit-${s.id}`} variant="ghost" size="icon" onClick={() => setEditing(s)} className="text-muted-foreground hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button id={`shipment-delete-${s.id}`} variant="ghost" size="icon" onClick={() => setDeleteId(s.id)} className="text-muted-foreground hover:text-destructive">
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
        <DialogContent id="shipment-dialog-add" className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle id="shipment-dialog-add-title" className="text-foreground">Nuevo envío</DialogTitle>
          </DialogHeader>
          <ShipmentForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent id="shipment-dialog-edit" className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle id="shipment-dialog-edit-title" className="text-foreground">Editar envío</DialogTitle>
          </DialogHeader>
          {editing && <ShipmentForm initialData={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingView;
