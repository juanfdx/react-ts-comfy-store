import { type LoaderFunction } from 'react-router-dom';
import { customFetch, type ProductsResponse, type ProductsResponseWithParams } from '@/utils';
import { QueryClient } from '@tanstack/react-query';


export const productsQuery = (params: Record<string, string>) => ({
  queryKey: ['products', params],
  queryFn: async (): Promise<ProductsResponse> => {
    const response = await customFetch<ProductsResponse>('/products', { params });
    return response.data;
  },
});


export const productsLoader = (queryClient: QueryClient): LoaderFunction =>
  async ({ request }): Promise<ProductsResponseWithParams> => {
    // Extract filter params from URL
    const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);

    // Prefetch using React Query
    const data = await queryClient.ensureQueryData(productsQuery(params));

    // Return data + params so Filters component can keep input state
    return { ...data, params };
  };
