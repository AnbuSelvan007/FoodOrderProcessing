import { Drawer, Typography, Flex, Button, Divider, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineShoppingBag } from 'react-icons/hi2';
import { useUiStore } from '@/shared/store/ui.store';
import { useCart } from '../hooks/useCart';
import './CartDrawer.css';

const { Title, Text } = Typography;

export function CartDrawer() {
  const navigate = useNavigate();
  const { isCartDrawerOpen, closeCartDrawer } = useUiStore();
  const { cart, isLoading, updateItem, removeItem, clearCart, isUpdating, isRemoving } = useCart();

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.05; // 5% tax
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + taxes + delivery;

  const handleUpdateQuantity = (cartItemId: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity <= 0) {
      removeItem(cartItemId);
    } else {
      updateItem({ cartItemId, data: { quantity: newQuantity } });
    }
  };

  return (
    <Drawer
      title={
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
          <Flex align="center" gap={8}>
            <HiOutlineShoppingBag size={20} />
            <Text strong style={{ fontSize: '1.2rem' }}>Your Cart</Text>
          </Flex>
          {cartItems.length > 0 && (
            <Button type="text" danger icon={<HiOutlineTrash />} onClick={() => clearCart()} size="small">
              Clear
            </Button>
          )}
        </Flex>
      }
      placement="right"
      onClose={closeCartDrawer}
      open={isCartDrawerOpen}
      width={400}
      className="cart-drawer"
    >
      <div className="cart-drawer__content">
        {isLoading ? (
          <Flex vertical align="center" justify="center" style={{ height: '100%' }}>
            <Spin size="large" />
          </Flex>
        ) : cartItems.length === 0 ? (
          <Flex vertical align="center" justify="center" style={{ height: '100%' }}>
            <HiOutlineShoppingBag size={64} color="var(--color-text-disabled)" />
            <Title level={4} style={{ color: 'var(--color-text-secondary)', marginTop: 16 }}>Your cart is empty</Title>
            <Text type="secondary">Add items from a restaurant to start a new cart</Text>
          </Flex>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item-card" style={{ opacity: isUpdating || isRemoving ? 0.6 : 1 }}>
              <div style={{ 
                width: 14, height: 14, border: `1px solid ${item.veg ? '#207945' : '#e43b4f'}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.veg ? '#207945' : '#e43b4f' }} />
              </div>
              <div className="cart-item-card__info">
                <Text strong style={{ display: 'block', fontSize: '1rem', lineHeight: 1.2, marginBottom: 4 }}>
                  {item.menuItemName}
                </Text>
                <Text type="secondary">₹{item.price}</Text>
              </div>
              <div className="cart-item-card__actions">
                <button 
                  className="cart-item-card__btn" 
                  onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                  disabled={isUpdating || isRemoving}
                >-</button>
                <span className="cart-item-card__qty">{item.quantity}</span>
                <button 
                  className="cart-item-card__btn" 
                  onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                  disabled={isUpdating || isRemoving}
                >+</button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-drawer__bill">
          <Title level={5} style={{ marginBottom: 'var(--space-4)' }}>Bill Details</Title>
          <div className="cart-drawer__bill-row">
            <Text type="secondary">Item Total</Text>
            <Text strong>₹{subtotal.toFixed(2)}</Text>
          </div>
          <div className="cart-drawer__bill-row">
            <Text type="secondary">Delivery Fee</Text>
            <Text strong>₹{delivery.toFixed(2)}</Text>
          </div>
          <div className="cart-drawer__bill-row">
            <Text type="secondary">Taxes</Text>
            <Text strong>₹{taxes.toFixed(2)}</Text>
          </div>
          
          <Divider style={{ margin: 'var(--space-3) 0' }} />
          
          <div className="cart-drawer__bill-row">
            <Title level={4} style={{ margin: 0 }}>To Pay</Title>
            <Title level={4} style={{ margin: 0 }}>₹{total.toFixed(2)}</Title>
          </div>

          <Button 
            type="primary" 
            size="large" 
            className="cart-drawer__checkout-btn"
            onClick={() => {
              closeCartDrawer();
              navigate('/checkout');
            }}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </Drawer>
  );
}
