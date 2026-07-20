export interface MockOrder {
  id: number;
  orderNumber: string;
  restaurantName: string;
  restaurantImage: string;
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  items: Array<{ name: string; quantity: number; price: number; isVeg: boolean }>;
  totalAmount: number;
  deliveryAddress: string;
  placedAt: string;
  estimatedDeliveryMinutes: number;
  deliveryPartner?: { name: string; phone: string; vehicleNumber: string };
}

export const MOCK_ACTIVE_ORDER: MockOrder = {
  id: 1001,
  orderNumber: 'FG-98421',
  restaurantName: 'Meghana Foods',
  restaurantImage: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80',
  status: 'PREPARING',
  items: [
    { name: 'Chicken Boneless Biryani', quantity: 1, price: 380, isVeg: false },
    { name: 'Peri Peri Fries', quantity: 2, price: 150, isVeg: true },
  ],
  totalAmount: 719,
  deliveryAddress: 'Flat 402, Sunshine Apartments, Indiranagar, Bangalore',
  placedAt: 'Just now',
  estimatedDeliveryMinutes: 28,
  deliveryPartner: {
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    vehicleNumber: 'KA-01-EV-4321',
  },
};

export const MOCK_PAST_ORDERS: MockOrder[] = [
  { ...MOCK_ACTIVE_ORDER, id: 1001, status: 'DELIVERED', placedAt: 'Yesterday at 8:30 PM' },
  {
    id: 1002,
    orderNumber: 'FG-97210',
    restaurantName: 'Truffles',
    restaurantImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80',
    status: 'DELIVERED',
    items: [{ name: 'All American Cheese Burger', quantity: 2, price: 350, isVeg: false }],
    totalAmount: 775,
    deliveryAddress: 'Flat 402, Sunshine Apartments, Indiranagar, Bangalore',
    placedAt: '15 July 2026, 1:15 PM',
    estimatedDeliveryMinutes: 0,
  },
];
