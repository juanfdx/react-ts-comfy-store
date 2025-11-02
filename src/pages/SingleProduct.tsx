import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  CartItem,
  formatAsDollars,
  type SingleProductResponse,
} from '@/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { SelectProductAmount, SelectProductColor } from '@/components';
import { Mode } from '@/components/SelectProductAmount';
import { useAppDispatch } from '@/hooks';
import { addItem } from '@/features/cart/cartSlice';




export default function SingleProduct() {
  const { data: product } = useLoaderData() as SingleProductResponse;
  const { image, title, price, description, colors, company } = product.attributes;
  const dispatch = useAppDispatch();

  const dollarsAmount = formatAsDollars(price);
  const [productColor, setProductColor] = useState(colors[0]);
  const [amount, setAmount] = useState(1);

  // Create a new product object, and add new prop cartID for CRUD operations in cartSlice.tsx
  const cartProduct: CartItem = {
    //use product color to generate different id, so same product with different color are different
    cartID: product.id + productColor, 
    productID: product.id,
    image,
    title,
    price,
    amount,
    productColor,
    company
  } 

  const addToCart = () => {
    dispatch(addItem(cartProduct));
  };


  return (
    <section>

      {/* BREADCRUMBS */}
      <div className='flex gap-x-2 h-6 items-center'>
        <Button asChild variant='link' size='sm'>
          <Link to='/'>Home</Link>
        </Button>
        <Separator orientation='vertical' />
        <Button asChild variant='link' size='sm'>
          <Link to='/products'>Products</Link>
        </Button>
      </div>

      {/* PRODUCT */}
      <div className='mt-6 grid gap-y-8 lg:grid-cols-2  lg:gap-x-16'>
        {/* IMAGE - COL1 */}
        <img
          src={image}
          alt={title}
          className='w-96 h-96 object-cover rounded-lg lg:w-full'
        />
        {/* PRODUCT INFO - COL2 */}
        <div>
          <h1 className='capitalize text-3xl font-bold'>{title}</h1>
          <h4 className='text-xl mt-2'>{company}</h4>
          <p className='mt-3 text-md bg-muted inline-block p-2 rounded-md'>
            {dollarsAmount}
          </p>
          <p className='mt-6 leading-8'>{description}</p>

          {/* COLORS */}
          <SelectProductColor 
            colors={colors}
            productColor={productColor} 
            setProductColor={setProductColor}
          />

          {/* AMOUNT */}
          <SelectProductAmount mode={Mode.SingleProduct} amount={amount} setAmount={setAmount}  />

          {/* CART BUTTON */}
          <Button size='lg' className='mt-10' onClick={addToCart}>
            Add to bag
          </Button>
        </div>
      </div>

    </section>
  )
}
