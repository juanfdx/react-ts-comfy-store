import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type CartItem, type CartState } from '@/utils';
import { toast } from '@/components/ui/use-toast';


const defaultState: CartState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 500,
  tax: 0,
  orderTotal: 0,
};


const getCartFromLocalStorage = (): CartState => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : defaultState;
};




const cartSlice = createSlice({
  name: 'cart',
  initialState: getCartFromLocalStorage(),
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newCartItem = action.payload;
      const item = state.cartItems.find((item) => item.cartID === newCartItem.cartID);
      if (item) {
        item.amount += newCartItem.amount;
      } else {
        state.cartItems.push(newCartItem);
      }
      //new item was added to cart so we update numItemsInCart, cartTotal and orderTotal
      state.numItemsInCart += newCartItem.amount;
      state.cartTotal += Number(newCartItem.price) * newCartItem.amount;
      //logic for invoking a reducer (calculateTotals:()) from another reducer (addItem:()), we use caseReducers
      cartSlice.caseReducers.calculateTotals(state);
      toast({description: 'Item added to cart'});
    },
    clearCart: () => {
      localStorage.setItem('cart', JSON.stringify(defaultState));
      return defaultState;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const cartID = action.payload;
      const item = state.cartItems.find((item) => item.cartID === cartID);

      if (!item) return;

      state.cartItems = state.cartItems.filter((item) => item.cartID!== cartID);

      state.numItemsInCart -= item.amount;
      state.cartTotal -= Number(item.price) * item.amount;

      cartSlice.caseReducers.calculateTotals(state);
      toast({description: 'Item removed from the cart'});
    },
    editItem: (state, action: PayloadAction<{cartID: string; amount: number}>) => {
      const {cartID, amount} = action.payload;
      const item = state.cartItems.find((item) => item.cartID === cartID);
      if (!item) return;

      state.numItemsInCart += amount - item.amount;
      state.cartTotal += Number(item.price) * (amount - item.amount);
      item.amount = amount;

      cartSlice.caseReducers.calculateTotals(state);
      toast({description: 'Item amount updated'});
    },
    calculateTotals: (state) => {
      state.tax = state.cartTotal * 0.1;
      state.orderTotal = state.cartTotal + state.tax + state.shipping;
      localStorage.setItem('cart', JSON.stringify(state));
    }
  },
});



export const { addItem, clearCart, removeItem, editItem, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
