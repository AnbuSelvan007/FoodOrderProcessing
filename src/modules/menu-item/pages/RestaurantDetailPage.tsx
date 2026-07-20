import { Typography, Flex, Tag, Spin, Button, App } from 'antd';
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiStar, HiClock, HiOutlineMapPin } from 'react-icons/hi2';
import { useRestaurant } from '@/modules/restaurant/hooks/useRestaurant';
import { useRestaurantMenu } from '../hooks/useRestaurantMenu';
import { useUiStore } from '@/shared/store/ui.store';
import { useCart } from '@/modules/cart/hooks/useCart';
import { useRestaurantRating } from '@/modules/restaurant-review/hooks/useRestaurantReview';
import { EmptyState } from '@/shared/components/EmptyState';
import './RestaurantDetailPage.css';

const { Title, Text } = Typography;

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const { openCartDrawer } = useUiStore();
  const { addItem, isAdding } = useCart();

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: menuItems, isLoading: isLoadingMenu } = useRestaurantMenu(restaurantId);
  const { data: ratingData } = useRestaurantRating(restaurantId);

  const [activeCategory, setActiveCategory] = useState<string>('');

  const groupedMenuItems = useMemo(() => {
    if (!menuItems) return {};
    const groups: Record<string, typeof menuItems> = {};
    menuItems.forEach((item) => {
      const cat = item.categoryName || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [menuItems]);

  const handleAddToCart = (menuItemId: number) => {
    addItem({ menuItemId, quantity: 1 }, {
      onSuccess: () => {
        openCartDrawer();
      }
    });
  };

  useEffect(() => {
    if (!menuItems || menuItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const activeId = visibleEntries[0].target.id;
          setActiveCategory(activeId.replace('cat-', '').replace(/-/g, ' '));
        }
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const elements = document.querySelectorAll('[id^="cat-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [menuItems]);

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!restaurant) {
    return <Title level={3}>Restaurant not found</Title>;
  }

  return (
    <div className="restaurant-detail-container">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <img className="restaurant-hero__bg" src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'} alt={restaurant.name} />
        <div className="restaurant-hero__overlay" />
        <div className="restaurant-hero__content">
          <Flex vertical gap={8}>
            <Title level={1} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>{restaurant.name}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>{restaurant.description}</Text>
            <Flex gap={16} style={{ marginTop: 'var(--space-2)' }}>
              <Text strong style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                <HiOutlineMapPin /> {restaurant.city || 'Location N/A'}
              </Text>
            </Flex>
          </Flex>
          <Flex vertical align="flex-end" gap={8}>
            <Tag color="success" style={{ fontSize: '1.25rem', padding: '4px 12px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
              {ratingData ? ratingData.averageRating.toFixed(1) : 'New'} <HiStar />
            </Tag>
            {ratingData && (
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                ({ratingData.totalReviews} reviews)
              </Text>
            )}
          </Flex>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-layout">
        {/* Sticky Sidebar (Categories) */}
        <div className="menu-sidebar">
          {Object.keys(groupedMenuItems).length > 0 ? (
            Object.keys(groupedMenuItems).map((category, idx) => (
              <a 
                key={idx}
                href={`#cat-${category.replace(/\s+/g, '-')}`}
                className={`menu-sidebar__link ${activeCategory.toLowerCase() === category.toLowerCase() ? 'active' : ''}`}
                style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`cat-${category.replace(/\s+/g, '-')}`)?.scrollIntoView({ behavior: 'smooth' });
                  setActiveCategory(category);
                }}
              >
                {category}
              </a>
            ))
          ) : (
            <Text className="menu-sidebar__link active">All Items</Text>
          )}
        </div>

        {/* Menu Items List */}
        <div className="menu-content">
          {Object.keys(groupedMenuItems).length > 0 ? (
            Object.entries(groupedMenuItems).map(([category, items]) => (
              <div key={category} id={`cat-${category.replace(/\s+/g, '-')}`} style={{ marginBottom: 32 }}>
                <Title level={4} style={{ marginBottom: 'var(--space-6)', fontWeight: 800 }}>{category}</Title>
                
                {items.map((item) => (
                  <div key={item.id} className="menu-item-card">
                    <div className="menu-item-card__info">
                      <Flex align="center" gap={8} style={{ marginBottom: 4 }}>
                        <div style={{ 
                          width: 14, height: 14, border: `1px solid ${item.veg ? '#207945' : '#e43b4f'}`, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2
                        }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.veg ? '#207945' : '#e43b4f' }} />
                        </div>
                        {item.price > 300 && <Tag color="gold" style={{ margin: 0, fontSize: '10px', fontWeight: 700 }}>BESTSELLER</Tag>}
                      </Flex>
                      
                      <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>{item.name}</Title>
                      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: '1rem' }}>₹{item.price}</Text>
                      
                      <Text type="secondary" style={{ display: 'block', lineHeight: 1.4, maxWidth: '80%' }}>
                        {item.description}
                      </Text>
                    </div>

                    <div className="menu-item-card__image-container">
                      <img className="menu-item-card__image" src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'} alt={item.name} />
                      <Button 
                        className="menu-item-card__add-btn" 
                        onClick={() => handleAddToCart(item.id)}
                        loading={isAdding}
                      >
                        ADD
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : null}

          {(!menuItems || menuItems.length === 0) && (
            <div style={{ padding: '40px 0' }}>
              <EmptyState 
                title="Menu is Empty" 
                description="This restaurant hasn't added any menu items yet." 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
