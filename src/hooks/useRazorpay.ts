import { useCallback } from 'react';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  amount: number; // in paise (e.g., 10000 = ₹100)
  description: string;
  prefillName?: string;
  prefillEmail?: string;
  prefillContact?: string;
  onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onFailure?: (error: any) => void;
}

export function useRazorpay() {
  const loadScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const openCheckout = useCallback(async (options: RazorpayOptions) => {
    const scriptLoaded = await loadScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your connection.');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('You must be logged in to make a payment.');
      return;
    }

    // 1. Create a Razorpay order on the backend
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const orderRes = await fetch(`${SUPABASE_URL}/functions/v1/create-razorpay-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        amount: options.amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok || orderData.error) {
      alert(`Failed to initiate payment: ${orderData.error}`);
      options.onFailure?.(orderData.error);
      return;
    }

    // 2. Open the Razorpay Checkout UI
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Wregals',
      description: options.description,
      order_id: orderData.order_id,
      prefill: {
        name: options.prefillName,
        email: options.prefillEmail,
        contact: options.prefillContact,
      },
      theme: { color: '#ffffff' },
      handler: async function (response: any) {
        // 3. Verify the payment signature on the backend
        const verifyRes = await fetch(`${SUPABASE_URL}/functions/v1/verify-razorpay-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(response),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          options.onSuccess(response);
        } else {
          options.onFailure?.({ message: 'Payment verification failed' });
        }
      },
    });

    rzp.on('payment.failed', function (response: any) {
      options.onFailure?.(response.error);
    });

    rzp.open();
  }, [loadScript]);

  return { openCheckout };
}
