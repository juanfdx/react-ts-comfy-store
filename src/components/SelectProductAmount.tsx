import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

//enum for select mode, we will use this to determine which select component to render
export enum Mode {
  SingleProduct = 'singleProduct',
  CartItem = 'cartItem',
}

type SelectProductAmountProps = {
  mode: Mode.SingleProduct;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
};

type SelectCartItemAmountProps = {
  mode: Mode.CartItem;
  amount: number;
  setAmount: (value: number) => void;
};


export default function SelectProductAmount({mode, amount, setAmount}: SelectProductAmountProps | SelectCartItemAmountProps) {
  /* 
  * check if mode is CartItem, means this component is being rendered in the cart component,
  * else if mode is SingleProduct, means this component is being rendered in the single product component
  */

  const cartItem = mode === Mode.CartItem;

  
  return (
    <>
      <h4 className={`font-medium ${cartItem ? 'mb-2' : 'my-2'}`}>Amount :</h4>
      
      <Select
        defaultValue={amount.toString()}
        onValueChange={(value) => setAmount(Number(value))}
      >
        <SelectTrigger className={cartItem ? 'w-[75px]' : 'w-[150px]'}>
          <SelectValue placeholder={amount} />
        </SelectTrigger>
        <SelectContent>
          {/* the amount will we cartItem amount selected + 10 */}
          {Array.from({ length: cartItem ? amount + 10 : 10 }, (_, index) => {
            //index + 1 because the index starts from 0, and select value must starts from 1
            const selectValue = (index + 1).toString();

            return (
              <SelectItem key={index} value={selectValue}>
                {selectValue}
              </SelectItem>
            );
            
          })}
        </SelectContent>
      </Select>
    </>
  )
}