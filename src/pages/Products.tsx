import { Filters, ProductsContainer, PaginationContainer } from '@/components';
import { customFetch, type ProductsResponse, type ProductsResponseWithParams } from '../utils';
import { type LoaderFunction } from 'react-router-dom';

const url = '/products';

/* 
* when use "request" params now url gonna be http://localhost:5173/products?search=
* the name "search" comes from the input named "search" in the Filters component
*/
export const loader: LoaderFunction = async ({request}): Promise<ProductsResponseWithParams> => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ])
 
  /* 
  * if there is no "search" param, axios ignore it and send get request back without params
  * ej: http://localhost:5173/products
  * if there is "search" param, axios send get request back with params
  * ej: http://localhost:5173/products?search=
  */
  const response = await customFetch<ProductsResponse>(url, {
    params,
  });

  /* 
  * If we want maintain the input value in the input named "search", so we send also
  * params in the response type in types.ts L38
  */
  return { ...response.data, params };
};


function Products() {
  
  return <>
    <Filters />
    <ProductsContainer />
    <PaginationContainer />
  </>
}
export default Products;
