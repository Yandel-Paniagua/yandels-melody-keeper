import { useState, useEffect } from "react";
import { Review } from "@/types/client";

const STORAGE_KEY = "yandels_reviews";

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setReviews(JSON.parse(stored));
  }, []);

  const save = (newItems: Review[]) => {
    setReviews(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const addReview = (review: Omit<Review, "id">) => {
    save([...reviews, { ...review, id: crypto.randomUUID() }]);
  };

  const deleteReview = (id: string) => {
    save(reviews.filter((r) => r.id !== id));
  };

  return { reviews, addReview, deleteReview };
};
