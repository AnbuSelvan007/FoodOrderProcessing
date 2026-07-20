import type { MenuItemResponse } from '../types/menu-item.types';

export const MOCK_MENU_ITEMS: Record<number, MenuItemResponse[]> = {
  1: [
    {
      id: 101,
      restaurantId: 1,
      categoryId: 1,
      name: 'All American Cheese Burger',
      description: 'Classic beef patty with double cheese, lettuce, tomato, and our secret sauce.',
      price: 350,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
      isAvailable: true,
      isVeg: false,
    },
    {
      id: 102,
      restaurantId: 1,
      categoryId: 1,
      name: 'Crispy Veg Burger',
      description: 'Crunchy potato patty with mayo, lettuce, and onions.',
      price: 220,
      imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&q=80',
      isAvailable: true,
      isVeg: true,
    },
    {
      id: 103,
      restaurantId: 1,
      categoryId: 2,
      name: 'Peri Peri Fries',
      description: 'Crispy french fries tossed in spicy peri peri seasoning.',
      price: 150,
      imageUrl: 'https://images.unsplash.com/photo-1576107222855-63518b06d04a?w=400&q=80',
      isAvailable: true,
      isVeg: true,
    }
  ],
  2: [
    {
      id: 201,
      restaurantId: 2,
      categoryId: 3,
      name: 'Chicken Boneless Biryani',
      description: 'Special boneless chicken pieces cooked with aromatic basmati rice.',
      price: 380,
      imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80',
      isAvailable: true,
      isVeg: false,
    },
    {
      id: 202,
      restaurantId: 2,
      categoryId: 3,
      name: 'Paneer Biryani',
      description: 'Fragrant basmati rice cooked with paneer cubes and special spices.',
      price: 320,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
      isAvailable: true,
      isVeg: true,
    },
    {
      id: 203,
      restaurantId: 2,
      categoryId: 4,
      name: 'Chicken 65',
      description: 'Spicy, deep-fried chicken appetizer originating from Chennai.',
      price: 280,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&q=80',
      isAvailable: true,
      isVeg: false,
    }
  ]
};
