import type { Property, PropertyStatus, PropertyType } from "@/lib/supabase/types";

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  venda: "Venda",
  aluguel: "Aluguel",
  lancamento: "Lançamento",
};

export const propertyStatusLabels: Record<PropertyStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  alugado: "Alugado",
};

export function formatAddress(property: Pick<Property, "neighborhood" | "city" | "state">) {
  return [property.neighborhood, property.city, property.state].filter(Boolean).join(", ");
}
