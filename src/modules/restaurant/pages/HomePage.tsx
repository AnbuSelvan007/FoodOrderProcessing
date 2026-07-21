import { useState } from 'react';
import { Typography, Flex, Card, Tag, Spin, Button } from 'antd';
import { HiStar, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useRestaurants } from '../hooks/useRestaurants';
import { useAllMenuItems } from '@/modules/menu-item/hooks/useRestaurantMenu';
import { useCart } from '@/modules/cart/hooks/useCart';
import { useUiStore } from '@/shared/store/ui.store';
import { EmptyState } from '@/shared/components/EmptyState';
import './HomePage.css';

const { Title, Text } = Typography;

export function HomePage() {
  const navigate = useNavigate();
  const { data: restaurants, isLoading: isLoadingRestaurants, isError: isErrorRestaurants } = useRestaurants();
  const { data: menuItems, isLoading: isLoadingMenu } = useAllMenuItems();
  const { addItem, isAdding } = useCart();
  const { openCartDrawer, searchQuery } = useUiStore();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filterName: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName]
    );
  };

  const handleAddToCart = (e: React.MouseEvent, menuItemId: number) => {
    e.stopPropagation();
    addItem({ menuItemId, quantity: 1 }, {
      onSuccess: () => {
        openCartDrawer();
      }
    });
  };

  // Filter Featured Food items
  const filteredMenuItems = (menuItems || []).filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.categoryName?.toLowerCase().includes(q) ||
        item.restaurantName?.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (activeFilters.includes('veg') && !item.veg) return false;
    if (activeFilters.includes('budget') && item.price >= 300) return false;
    if (activeFilters.includes('fast') && item.preparationTime > 30) return false;

    return true;
  });

  // Filter Restaurants
  const filteredRestaurants = (restaurants || []).filter((restaurant) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesRestaurant =
        restaurant.name.toLowerCase().includes(q) ||
        restaurant.description?.toLowerCase().includes(q) ||
        restaurant.address?.toLowerCase().includes(q) ||
        restaurant.city?.toLowerCase().includes(q);

      const matchesMenuItem = menuItems?.some(
        (m) => m.restaurantId === restaurant.id && (m.name.toLowerCase().includes(q) || m.categoryName?.toLowerCase().includes(q))
      );

      if (!matchesRestaurant && !matchesMenuItem) return false;
    }

    if (activeFilters.includes('veg')) {
      const hasVegItem = menuItems?.some((m) => m.restaurantId === restaurant.id && m.veg);
      if (!hasVegItem) return false;
    }
    if (activeFilters.includes('budget') && restaurant.minimumOrderAmount > 300) return false;
    if (activeFilters.includes('fast') && (restaurant.averagePreparationTime || 30) > 30) return false;

    return true;
  });

  if (isLoadingRestaurants || isLoadingMenu) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (isErrorRestaurants) {
    return <Text type="danger">Failed to load data.</Text>;
  }

  return (
    <div className="homepage-container">
      {/* Featured Menu Items (Replacing mock categories) */}
      <section style={{ marginTop: 8 }}>
        <Title level={4} style={{ marginBottom: 'var(--space-4)', fontWeight: 800 }}>
          {searchQuery ? `Dishes matching "${searchQuery}"` : "What's on your mind? (Featured Foods)"}
        </Title>
        <div style={{ display: 'flex', overflowX: 'auto', gap: 16, paddingBottom: 16 }}>
          {filteredMenuItems.slice(0, 10).map((item) => (
            <Card 
              key={item.id} 
              hoverable 
              style={{ minWidth: 200, borderRadius: 'var(--radius-lg)' }}
              bodyStyle={{ padding: 12 }}
              cover={<img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'} alt={item.name} style={{ height: 120, objectFit: 'cover' }} />}
              onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
            >
              <Title level={5} style={{ margin: 0, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </Title>
              <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
                <Text strong>₹{item.price}</Text>
                <Button size="small" type="primary" onClick={(e) => handleAddToCart(e, item.id)} loading={isAdding}>
                  ADD
                </Button>
              </Flex>
            </Card>
          ))}
          {filteredMenuItems.length === 0 && (
            <Text type="secondary">No menu items match your search or filters.</Text>
          )}
        </div>
      </section>

      {/* Filter & Sort Pills Bar */}
      <section style={{ marginTop: 12 }}>
        <div className="filter-pills-bar">
          <div className="filter-pill">
            <HiOutlineAdjustmentsHorizontal size={16} /> Filter
          </div>
          <div
            className={`filter-pill ${activeFilters.includes('fast') ? 'active' : ''}`}
            onClick={() => toggleFilter('fast')}
          >
            Fast Delivery
          </div>
          <div
            className={`filter-pill ${activeFilters.includes('rating') ? 'active' : ''}`}
            onClick={() => toggleFilter('rating')}
          >
            Ratings 4.0+
          </div>
          <div
            className={`filter-pill ${activeFilters.includes('veg') ? 'active' : ''}`}
            onClick={() => toggleFilter('veg')}
          >
            Pure Veg
          </div>
          <div
            className={`filter-pill ${activeFilters.includes('budget') ? 'active' : ''}`}
            onClick={() => toggleFilter('budget')}
          >
            Less than ₹300
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section style={{ marginTop: 16 }}>
        <Title level={4} style={{ marginBottom: 'var(--space-6)', fontWeight: 800 }}>
          {searchQuery ? `Restaurants matching "${searchQuery}"` : "Top restaurant chains in Bangalore"}
        </Title>
        <div className="restaurant-grid">
          {filteredRestaurants.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px 0' }}>
              <EmptyState 
                title="No Restaurants Found" 
                description="We couldn't find any restaurants matching your criteria right now. Try adjusting your search or filters." 
              />
            </div>
          )}
          {filteredRestaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              hoverable
              className="restaurant-card"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              bordered={false}
            >
              <div className="restaurant-card__cover-wrapper">
                <img
                  className="restaurant-card__cover-img"
                  alt={restaurant.name}
                  src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'}
                />

                {restaurant.availability !== 'OPEN' && (
                  <div className="restaurant-card__closed-overlay">
                    <Title level={5} style={{ margin: 0, color: '#fff', fontWeight: 800, letterSpacing: '1px' }}>
                      CLOSED
                    </Title>
                  </div>
                )}
              </div>

              <div className="restaurant-card__details">
                <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                  <Title
                    level={5}
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '70%',
                    }}
                  >
                    {restaurant.name}
                  </Title>
                  <Tag
                    color="success"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      border: 'none',
                      margin: 0,
                    }}
                  >
                    New <HiStar size={12} />
                  </Tag>
                </Flex>

                <Text
                  type="secondary"
                  style={{
                    fontSize: '0.9rem',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {restaurant.description}
                </Text>

                <Text
                  type="secondary"
                  style={{
                    fontSize: '0.85rem',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  {restaurant.address}
                </Text>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
