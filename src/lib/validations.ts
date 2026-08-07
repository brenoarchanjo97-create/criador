import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Informe um telefone válido"),
  creci: z.string().min(3, "Informe seu CRECI"),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
});

export const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export const propertySchema = z.object({
  type: z.enum(["venda", "aluguel", "lancamento"]),
  title: z.string().min(5, "Título muito curto"),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
  condoFee: z.coerce.number().nonnegative().optional(),
  iptu: z.coerce.number().nonnegative().optional(),
  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().optional(),
  zip: z.string().optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  bathrooms: z.coerce.number().int().nonnegative().optional(),
  parkingSpots: z.coerce.number().int().nonnegative().optional(),
  areaM2: z.coerce.number().nonnegative().optional(),
  furnished: z.coerce.boolean().optional(),
  status: z.enum(["disponivel", "reservado", "vendido", "alugado"]),
});

export const profileSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  creci: z.string().optional(),
  bio: z.string().optional(),
  instagram: z.string().optional(),
  region: z.string().optional(),
  specialties: z.string().optional(),
});

export const testimonialSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  quote: z.string().min(10, "Escreva um pouco mais sobre sua experiência"),
});
