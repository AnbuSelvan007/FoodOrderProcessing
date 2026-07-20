import { useState } from 'react';
import { Typography, Flex, Button, Radio, Divider, App, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMapPin, HiOutlineCreditCard, HiOutlineBanknotes, HiOutlineQrCode, HiOutlineCheckCircle } from 'react-icons/hi2';
import { useUiStore } from '@/shared/store/ui.store';
import { useAddresses } from '@/modules/address/hooks/useAddresses';
import { AddressSelectionModal } from '@/modules/address/components/AddressSelectionModal';
import { useCart } from '@/modules/cart/hooks/useCart';
import { usePayment } from '@/modules/payment/hooks/usePayment';
import { PaymentMethod } from '@/modules/payment/types/payment.types';
import './CheckoutPage.css';

const { Title, Text } = Typography;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { closeCartDrawer } = useUiStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI' as PaymentMethod);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();

  const { addresses } = useAddresses();
  const displayAddress = addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.isDefault) || addresses[0];

  const { cart, isLoading, clearCart } = useCart();
  const { createPayment, isCreating: isPlacing } = usePayment();
  
  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.05;
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + taxes + delivery;

  const handlePlaceOrder = async () => {
    try {
      // Assuming order is created first, we'll use a placeholder orderId of 1024 for this demo
      const orderId = 1024;
      
      await createPayment({
        orderId,
        paymentMethod,
      });

      closeCartDrawer();
      message.success('Payment completed and Order placed successfully!');
      clearCart();
      navigate('/order-tracking/1024');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddressId(address.id);
    setAddressModalOpen(false);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Flex vertical justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Title level={3}>Your cart is empty</Title>
        <Button type="primary" onClick={() => navigate('/')}>Browse Restaurants</Button>
      </Flex>
    );
  }

  return (
    <div className="checkout-container">
      {/* Left Column: Delivery Address & Payment */}
      <div>
        <div className="checkout-section">
          <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
            <Flex align="center" gap={12}>
              <HiOutlineMapPin size={24} color="var(--color-primary)" />
              <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Delivery Address</Title>
            </Flex>
            <Button type="link" onClick={() => setAddressModalOpen(true)}>Change</Button>
          </Flex>

          {displayAddress ? (
            <div className="checkout-address-card selected">
              <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                <Flex align="center" gap={8}>
                  <Text strong style={{ fontSize: '1rem' }}>{displayAddress.label}</Text>
                  {displayAddress.isDefault && <Tag color="blue">Default</Tag>}
                </Flex>
                <HiOutlineCheckCircle color="var(--color-primary)" size={20} />
              </Flex>
              <Text type="secondary" style={{ display: 'block' }}>
                {displayAddress.houseNo}, {displayAddress.street}, {displayAddress.area}, {displayAddress.city} - {displayAddress.postalCode}
              </Text>
              <Text strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginTop: 8, display: 'inline-block' }}>
                30 MINS DELIVERY TIME
              </Text>
            </div>
          ) : (
            <div className="checkout-address-card" style={{ textAlign: 'center', padding: '24px 0' }}>
              <Text type="secondary">No delivery address selected.</Text>
              <br />
              <Button type="primary" style={{ marginTop: 12 }} onClick={() => setAddressModalOpen(true)}>
                Add an Address
              </Button>
            </div>
          )}
        </div>

        {/* Payment Method Section */}
        <div className="checkout-section">
          <Flex align="center" gap={12} style={{ marginBottom: 16 }}>
            <HiOutlineCreditCard size={24} color="var(--color-primary)" />
            <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Payment Method</Title>
          </Flex>

          <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} style={{ width: '100%' }}>
            <div 
              className={`payment-option-card ${paymentMethod === PaymentMethod.UPI ? 'selected' : ''}`}
              onClick={() => setPaymentMethod(PaymentMethod.UPI)}
            >
              <Radio value={PaymentMethod.UPI} />
              <HiOutlineQrCode size={24} color="var(--color-primary)" />
              <div>
                <Text strong style={{ display: 'block' }}>UPI (Google Pay / PhonePe / Paytm)</Text>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Pay instantly using any UPI App</Text>
              </div>
            </div>

            <div 
              className={`payment-option-card ${paymentMethod === PaymentMethod.CREDIT_CARD ? 'selected' : ''}`}
              onClick={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
            >
              <Radio value={PaymentMethod.CREDIT_CARD} />
              <HiOutlineCreditCard size={24} color="var(--color-primary)" />
              <div>
                <Text strong style={{ display: 'block' }}>Credit / Debit Card</Text>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Visa, Mastercard, RuPay, Amex</Text>
              </div>
            </div>

            <div 
              className={`payment-option-card ${paymentMethod === PaymentMethod.CASH_ON_DELIVERY ? 'selected' : ''}`}
              onClick={() => setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY)}
            >
              <Radio value={PaymentMethod.CASH_ON_DELIVERY} />
              <HiOutlineBanknotes size={24} color="var(--color-primary)" />
              <div>
                <Text strong style={{ display: 'block' }}>Cash on Delivery</Text>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Pay cash or UPI at time of delivery</Text>
              </div>
            </div>
          </Radio.Group>
        </div>
      </div>

      {/* Right Column: Order Summary & Place Order */}
      <div>
        <div className="checkout-summary-card">
          <Title level={4} style={{ marginBottom: 16, fontWeight: 800 }}>Order Summary</Title>
          
          <Text strong type="secondary" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {cart?.restaurantName || 'Restaurant'}
          </Text>

          <div style={{ margin: '12px 0' }}>
            {cartItems.map((item) => (
              <Flex key={item.id} justify="space-between" style={{ marginBottom: 8 }}>
                <Text>{item.menuItemName} x {item.quantity}</Text>
                <Text strong>₹{(item.price * item.quantity).toFixed(2)}</Text>
              </Flex>
            ))}
          </div>

          <Divider style={{ margin: '16px 0' }} />

          <Flex justify="space-between" style={{ marginBottom: 8 }}>
            <Text type="secondary">Item Total</Text>
            <Text>₹{subtotal.toFixed(2)}</Text>
          </Flex>
          <Flex justify="space-between" style={{ marginBottom: 8 }}>
            <Text type="secondary">Delivery Fee</Text>
            <Text>₹{delivery.toFixed(2)}</Text>
          </Flex>
          <Flex justify="space-between" style={{ marginBottom: 8 }}>
            <Text type="secondary">Taxes & Charges</Text>
            <Text>₹{taxes.toFixed(2)}</Text>
          </Flex>

          <Divider style={{ margin: '16px 0' }} />

          <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
            <Title level={4} style={{ margin: 0 }}>To Pay</Title>
            <Title level={4} style={{ margin: 0, color: 'var(--color-primary)' }}>₹{total.toFixed(2)}</Title>
          </Flex>

          <Button 
            type="primary" 
            size="large" 
            block 
            loading={isPlacing} 
            onClick={handlePlaceOrder}
            style={{ height: 50, borderRadius: 'var(--radius-lg)', fontWeight: 800, fontSize: '1.1rem' }}
          >
            PLACE ORDER
          </Button>
        </div>
      </div>

      <AddressSelectionModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSelect={handleAddressSelect}
        selectedAddressId={displayAddress?.id}
      />
    </div>
  );
}
