import { ActionFunction, Form, redirect } from 'react-router-dom';
import FormInput from './FormInput';
import SubmitBtn from './SubmitBtn';
import { customFetch, formatAsDollars, type Checkout } from '@/utils';
import { toast } from '@/components/ui/use-toast';
import { clearCart } from '../features/cart/cartSlice';
import { ReduxStore } from '@/store';


export const action = (store: ReduxStore): ActionFunction => async ({ request }): Promise<Response | null> => {


  const formData = await request.formData();
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;

  if (!name ||!address) {
    toast({description: 'Please fill in all fields'});
    return null;
  }

  // Check if user is logged in
  const user = store.getState().userState.user;
  if (!user) {
    toast({description: 'Please login to place an order'});
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

  //make the request to the backend
  try {
    const result = await customFetch.post('/orders', { data: info }, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,//send the token to the backend
        },
      }
    );
console.log(result);

    store.dispatch(clearCart());
    toast({ description: 'order placed' });
    return redirect('/orders');

  } catch (error) {
    toast({ description: 'order failed' });
    return null;
  }
}


export default function CheckoutForm() {

  return (
    <Form method='POST' className='flex flex-col gap-y-4'>
      <h4 className='font-medium text-xl mb-4'>Shipping Information</h4>

      <FormInput label='first name' name='name' type='text' />
      <FormInput label='address' name='address' type='text' />

      <div className='mt-4'>
        <SubmitBtn text='Place Your Order' />
      </div>
    </Form>
  );
}