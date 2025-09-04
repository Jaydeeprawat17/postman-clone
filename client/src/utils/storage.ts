import { RequestHistoryItem } from "../types";

const API_URL = "https://postman-backend-fej1.onrender.com"; // your Express backend

export async function saveToHistory(item: RequestHistoryItem): Promise<void> {
  await fetch(`${API_URL}/save-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export async function getHistory(
  page: number = 1
): Promise<{ items: RequestHistoryItem[]; total: number; page: number }> {
  const res = await fetch(`${API_URL}/history?page=${page}`);
  return res.json();
}

export async function clearHistory(): Promise<void> {
  await fetch(`${API_URL}/history`, { method: "DELETE" });
}

export async function deleteFromHistory(id: string): Promise<void> {
  await fetch(`${API_URL}/history/${id}`, { method: "DELETE" });
}
