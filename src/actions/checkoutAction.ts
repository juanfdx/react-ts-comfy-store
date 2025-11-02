import { ActionFunction, redirect } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { customFetch, formatAsDollars, type Checkout } from '@/utils';
import { ReduxStore } from '@/store';
import { clearCart } from '../features/cart/cartSlice';
import { QueryClient } from '@tanstack/react-query';

/**
 * Checkout action
 * @param store Redux store
 * @param queryClient React Query client
 */
export const checkoutAction = (store: ReduxStore, queryClient: QueryClient): ActionFunction =>
  async ({ request }) => {

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;

    if (!name || !address) {
      toast({ description: 'Please fill in all fields' });
      return null;
    }

    const user = store.getState().userState.user;
    if (!user) {
      toast({ description: 'Please login to place an order' });
      return redirect('/login');
    }

    const { cartItems, orderTotal, numItemsInCart } = store.getState().cartState;

    // Create the object we want to send to the backend
    const info: Checkout = {
      name,
      address,
      chargeTotal: orderTotal,
      orderTotal: formatAsDollars(orderTotal),
      cartItems,
      numItemsInCart,
    };

    try {
      // Post new order
      await customFetch.post('/orders', { data: info }, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      });

      // Clear cart in Redux
      store.dispatch(clearCart());
      // Remove cached orders so next loader fetches fresh data
      queryClient.removeQueries({ queryKey: ['orders'] });

      toast({ description: 'Order placed successfully!' });

      return redirect('/orders');
      
    } catch (error) {
      console.error(error);
      toast({ description: 'Order failed. Please try again.' });
      return null;
    }
  };
