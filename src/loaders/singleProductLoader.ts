import { type LoaderFunction } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { customFetch, type SingleProductResponse } from '@/utils';


const singleProductQuery = (id: string) => ({
  queryKey: ['singleProduct', id],
  queryFn: async () => customFetch<SingleProductResponse>(`/products/${id}`),
});


// 🔹 Loader factory — strongly typed for React Router + React Query
export const singleProductLoader = (queryClient: QueryClient): LoaderFunction =>
  async ({ params }): Promise<SingleProductResponse> => {
    const id = params.id!;
    const response = await queryClient.ensureQueryData(singleProductQuery(id));
    
    return { ...response.data };
  };



