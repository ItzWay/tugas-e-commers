const images: Record<string, string> = {
  "Kulit jok biasa": "/images/products/kulit-polos.jpeg",
  "Kulit jok motif": "/images/products/kulit-motif.jpeg",
  "Busa": "/images/products/busa.jpeg",
  "Fiber / tulangan jok": "/images/products/fiber.jpeg",
  "Latex": "/images/products/latex.jpeg",
  "Satu set jok custom": "/images/products/jok-custom.jpeg",
};

export function productImage(productName: string) {
  return images[productName] ?? "/images/products/jok-custom.jpeg";
}
