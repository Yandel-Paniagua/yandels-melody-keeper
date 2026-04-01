import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { Review } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Star, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ReviewForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<Review, "id">) => void;
  onCancel: () => void;
}) => {
  const [clienteNombre, setClienteNombre] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clienteNombre,
      calificacion,
      comentario,
      fecha: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form id="review-form" onSubmit={handleSubmit} className="space-y-4">
      <div id="review-nombre-field">
        <label id="review-nombre-label" htmlFor="review-nombre" className="text-sm font-medium text-foreground block mb-1.5">Nombre del cliente</label>
        <Input id="review-nombre" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} required className="bg-input border-border text-foreground" />
      </div>
      <div id="review-rating-field">
        <label id="review-rating-label" className="text-sm font-medium text-foreground block mb-1.5">Calificación</label>
        <div id="review-stars" className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              id={`review-star-${star}`}
              type="button"
              onClick={() => setCalificacion(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= calificacion ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div id="review-comentario-field">
        <label id="review-comentario-label" htmlFor="review-comentario" className="text-sm font-medium text-foreground block mb-1.5">Reseña</label>
        <Textarea
          id="review-comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
          rows={4}
          placeholder="¿Qué le pareció la tienda?"
          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div id="review-form-actions" className="flex gap-3 pt-2">
        <Button id="review-form-submit" type="submit" className="flex-1">Publicar reseña</Button>
        <Button id="review-form-cancel" type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
      </div>
    </form>
  );
};

const ReviewsView = () => {
  const { reviews, addReview, deleteReview } = useReviews();
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (data: Omit<Review, "id">) => {
    addReview(data);
    setShowForm(false);
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.calificacion, 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <div id="reviews-view">
      <div id="reviews-toolbar" className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        <div id="reviews-stats" className="flex-1">
          <p id="reviews-avg" className="text-muted-foreground text-sm">
            Promedio: <span className="text-primary font-bold text-lg">{avgRating}</span> ⭐ · {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button id="reviews-add-btn" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva reseña
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div id="reviews-empty" className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p id="reviews-empty-text" className="text-muted-foreground">No hay reseñas todavía. ¡Agrega la primera!</p>
        </div>
      ) : (
        <div id="reviews-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <Card key={review.id} id={`review-card-${review.id}`} className="bg-card border-border">
              <CardHeader id={`review-header-${review.id}`} className="pb-2">
                <div id={`review-top-${review.id}`} className="flex items-center justify-between">
                  <div id={`review-info-${review.id}`}>
                    <p id={`review-name-${review.id}`} className="font-semibold text-foreground">{review.clienteNombre}</p>
                    <p id={`review-date-${review.id}`} className="text-xs text-muted-foreground">{review.fecha}</p>
                  </div>
                  <div id={`review-actions-${review.id}`} className="flex items-center gap-2">
                    <div id={`review-stars-display-${review.id}`} className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          id={`review-${review.id}-star-${star}`}
                          className={`w-4 h-4 ${
                            star <= review.calificacion ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <Button id={`review-delete-${review.id}`} variant="ghost" size="icon" onClick={() => deleteReview(review.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent id={`review-content-${review.id}`}>
                <p id={`review-text-${review.id}`} className="text-secondary-foreground text-sm leading-relaxed">"{review.comentario}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent id="review-dialog-add" className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle id="review-dialog-add-title" className="text-foreground">Nueva reseña</DialogTitle>
          </DialogHeader>
          <ReviewForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsView;
