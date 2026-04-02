const { z } = require('zod');
const productSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  category: z.string().optional().nullable(),
  image_url: z.string().optional().nullable()
});

module.exports = productSchema; // Exportação direta