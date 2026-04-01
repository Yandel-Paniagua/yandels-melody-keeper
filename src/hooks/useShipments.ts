import { useState, useEffect } from "react";
import { Shipment } from "@/types/client";

const STORAGE_KEY = "yandels_shipments";

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setShipments(JSON.parse(stored));
  }, []);

  const save = (newItems: Shipment[]) => {
    setShipments(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const addShipment = (shipment: Omit<Shipment, "id">) => {
    save([...shipments, { ...shipment, id: crypto.randomUUID() }]);
  };

  const updateShipment = (id: string, data: Omit<Shipment, "id">) => {
    save(shipments.map((s) => (s.id === id ? { ...data, id } : s)));
  };

  const deleteShipment = (id: string) => {
    save(shipments.filter((s) => s.id !== id));
  };

  return { shipments, addShipment, updateShipment, deleteShipment };
};
