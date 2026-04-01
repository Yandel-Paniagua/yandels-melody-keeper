import { useState, useEffect } from "react";
import { MusicItem } from "@/types/music";

const STORAGE_KEY = "yandels_inventory";

export const useInventory = () => {
  const [items, setItems] = useState<MusicItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const save = (newItems: MusicItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const addItem = (item: Omit<MusicItem, "id">) => {
    const newItem: MusicItem = { ...item, id: crypto.randomUUID() };
    save([...items, newItem]);
  };

  const updateItem = (id: string, data: Omit<MusicItem, "id">) => {
    save(items.map((i) => (i.id === id ? { ...data, id } : i)));
  };

  const deleteItem = (id: string) => {
    save(items.filter((i) => i.id !== id));
  };

  return { items, addItem, updateItem, deleteItem };
};
