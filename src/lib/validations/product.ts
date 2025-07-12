import * as z from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis"),
  description: z.string().min(1, "La description est requise"),
  gamme: z.string().min(1, "La gamme est requise"),
  famille: z.string().min(1, "La famille est requise"),
  emballage: z.enum(["seau-metallique", "seau-plastique"], {
    required_error: "L'emballage est requis"
  }),
  quantite: z.string().refine((val) => parseInt(val) >= 100, {
    message: "La quantité minimale est de 100"
  }),
  poids: z.string().min(1, "Le poids est requis"),
  couleurs: z.array(z.string()),
  manufacturingDate: z.date().optional(),
  expirationDate: z.date().optional(),
})

export type ProductFormData = z.infer<typeof productSchema> 