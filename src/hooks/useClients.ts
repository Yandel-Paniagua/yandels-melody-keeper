import { useState, useEffect } from "react";
import { Client } from "@/types/client";

const STORAGE_KEY = "yandels_clients";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setClients(JSON.parse(stored));
  }, []);

  const save = (newItems: Client[]) => {
    setClients(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const addClient = (client: Omit<Client, "id">) => {
    save([...clients, { ...client, id: crypto.randomUUID() }]);
  };

  const updateClient = (id: string, data: Omit<Client, "id">) => {
    save(clients.map((c) => (c.id === id ? { ...data, id } : c)));
  };

  const deleteClient = (id: string) => {
    save(clients.filter((c) => c.id !== id));
  };

  return { clients, addClient, updateClient, deleteClient };
};
