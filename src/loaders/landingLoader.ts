import { type LoaderFunction } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { ProductsResponse, customFetch } from '@/utils';

const url = '/products?featured=true';

const featuredProductsQuery = {
  queryKey: ['featured'],
  queryFn: async () => customFetch<ProductsResponse>(url),
};



export const landingLoader = (queryClient: QueryClient): LoaderFunction =>
  async (): Promise<ProductsResponse> => {

    const response = await queryClient.ensureQueryData(featuredProductsQuery);
    return { ...response.data };

  };
