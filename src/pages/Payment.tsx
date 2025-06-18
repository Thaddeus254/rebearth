import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  cartItems: any[];
  totalAmount: number;
  orderNumber: string;
  timestamp: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    const storedData = sessionStorage.getItem('checkoutData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setCheckoutData(data);
      setMpesaNumber(data.phone);
      // Generate unique account number
      setAccountNumber(`ACC${Date.now().toString().slice(-8)}`);
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const handlePayment = () => {
    if (!checkoutData) return;

    setIsProcessing(true);
    
    // Simulate M-Pesa payment process
    setTimeout(() => {
      setIsProcessing(false);
      setShowPinPrompt(true);
    }, 2000);
  };

  const handlePinConfirmation = () => {
    setShowPinPrompt(false);
    setIsProcessing(true);

    // Simulate payment completion
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      clearCart();
      
      // Store order in user's order history
      const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      orders.push({
        ...checkoutData,
        paymentMethod,
        accountNumber,
        status: 'completed',
        paidAt: new Date().toISOString()
      });
      localStorage.setItem('userOrders', JSON.stringify(orders));
      
      // Clear checkout data
      sessionStorage.removeItem('checkoutData');
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been confirmed and will be processed shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Order Number:</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900">{checkoutData.orderNumber}</span>
                <button
                  onClick={() => copyToClipboard(checkoutData.orderNumber)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Account Number:</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900">{accountNumber}</span>
                <button
                  onClick={() => copyToClipboard(accountNumber)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-green-600">KES {checkoutData.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Checkout</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600">Complete your payment to confirm your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-6">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'mpesa' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('mpesa')}
              >
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">M-Pesa</h3>
                    <p className="text-sm text-gray-600">Pay with your mobile money</p>
                  </div>
                </div>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'card' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
                    <p className="text-sm text-gray-600">Pay with Visa, Mastercard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* M-Pesa Payment Form */}
            {paymentMethod === 'mpesa' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="mpesaNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    id="mpesaNumber"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
                    placeholder="+254 xxx xxx xxx"
                  />
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Payment Instructions:</h4>
                  <ol className="text-sm text-green-700 space-y-1">
                    <li>1. Click "Pay with M-Pesa" below</li>
                    <li>2. You'll receive an STK push notification</li>
                    <li>3. Enter your M-Pesa PIN to complete payment</li>
                    <li>4. You'll receive a confirmation SMS</li>
                  </ol>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !mpesaNumber}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-5 w-5" />
                      <span>Pay with M-Pesa</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
                      placeholder="123"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Pay with Card</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-bold text-gray-900">{checkoutData.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-bold text-gray-900">{accountNumber}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {checkoutData.cartItems.map((item: any) => (
                <div key={item.product.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">
                      KES {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Information */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{checkoutData.name}</p>
                <p>{checkoutData.address}</p>
                <p>{checkoutData.city} {checkoutData.postalCode}</p>
                <p>{checkoutData.phone}</p>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-6">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-green-600">KES {checkoutData.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa PIN Prompt Modal */}
      {showPinPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <Smartphone className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">M-Pesa Payment Request</h3>
              <p className="text-gray-600 mb-6">
                A payment request has been sent to <strong>{mpesaNumber}</strong>. 
                Please check your phone and enter your M-Pesa PIN to complete the payment.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Please enter your PIN within 60 seconds
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePinConfirmation}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  I've Entered My PIN
                </button>
                <button
                  onClick={() => setShowPinPrompt(false)}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;