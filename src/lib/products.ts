import { Product, Size } from './types';

export const sizes: Size[] = [
  { name: '6"', label: '6" - Pequeño (6-8 personas)', priceMultiplier: 0.8 },
  { name: '8"', label: '8" - Mediano (10-12 personas)', priceMultiplier: 1 },
  { name: '10"', label: '10" - Grande (15-20 personas)', priceMultiplier: 1.4 },
  { name: '12"', label: '12" - Extra Grande (25-30 personas)', priceMultiplier: 1.8 },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Torta de Chocolate',
    price: 65.00,
    description: 'Deliciosa torta de chocolate con capas de bizcocho húmedo y ganache de chocolate belga. Cubierta con crema de chocolate y decorada con virutas.',
    image: 'chocolate-cake',
    category: 'Clásicas',
    availableSizes: sizes,
  },
  {
    id: 2,
    name: 'Torta de Vainilla',
    price: 60.00,
    description: 'Suave torta de vainilla con relleno de crema pastelera y cubierta de buttercream. Perfecta para cualquier celebración.',
    image: 'vanilla-cake',
    category: 'Clásicas',
    availableSizes: sizes,
  },
  {
    id: 3,
    name: 'Torta Red Velvet',
    price: 75.00,
    description: 'Icónica torta Red Velvet con su característico color rojo intenso, relleno de cream cheese y decoración elegante.',
    image: 'red-velvet-cake',
    category: 'Especiales',
    availableSizes: sizes,
  },
  {
    id: 4,
    name: 'Torta de Zanahoria',
    price: 70.00,
    description: 'Torta de zanahoria casera con especias aromáticas, nueces y cubierta de cream cheese. Una opción deliciosa y saludable.',
    image: 'carrot-cake',
    category: 'Especiales',
    availableSizes: sizes,
  },
  {
    id: 5,
    name: 'Black Forest',
    price: 80.00,
    description: 'Clásica Selva Negra con capas de bizcocho de chocolate, crema chantilly, cerezas y virutas de chocolate.',
    image: 'black-forest-cake',
    category: 'Premium',
    availableSizes: sizes,
  },
  {
    id: 6,
    name: 'Torta de Fresa',
    price: 65.00,
    description: 'Torta fresca de fresa con crema chantilly y fresas naturales. Ligera y perfecta para el verano.',
    image: 'strawberry-cake',
    category: 'Clásicas',
    availableSizes: sizes,
  },
  {
    id: 7,
    name: 'Torta Tres Leches',
    price: 68.00,
    description: 'Tradicional torta tres leches, empapada en una mezcla de tres tipos de leche y coronada con merengue.',
    image: 'tres-leches',
    category: 'Tradicionales',
    availableSizes: sizes,
  },
  {
    id: 8,
    name: 'Torta de Limón',
    price: 62.00,
    description: 'Refrescante torta de limón con relleno de curd de limón y merengue italiano. Perfecta para los amantes de lo cítrico.',
    image: 'lemon-cake',
    category: 'Especiales',
    availableSizes: sizes,
  },
  {
    id: 9,
    name: 'Torta Selva Tropical',
    price: 78.00,
    description: 'Exótica combinación de frutas tropicales con crema de coco y bizcocho esponjoso. Decorada con frutas frescas.',
    image: 'tropical-cake',
    category: 'Premium',
    availableSizes: sizes,
  },
];

export const categories = ['Todas', 'Clásicas', 'Especiales', 'Premium', 'Tradicionales'];
