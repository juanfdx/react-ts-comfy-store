import { LoaderFunction, redirect } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { ReduxStore } from '@/store';
import { toast } from '@/components/ui/use-toast';
import { customFetch, type OrdersResponse } from '@/utils';


export const ordersQuery = (jwt: string, params: Record<string, string>) => ({
  queryKey: ['orders', params],
  queryFn: async (): Promise<OrdersResponse> => {
    const response = await customFetch.get<OrdersResponse>('/orders', {
      params,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  },
});


export const ordersLoader = (store: ReduxStore, queryClient: QueryClient): LoaderFunction =>
  async ({ request }): Promise<OrdersResponse | Response | null> => {

    const user = store.getState().userState.user;

    if (!user) {
      toast({ description: 'Please login to continue' });
      return redirect('/login');
    }

    const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);

    try {
      // Prefetch using React Query
      const data = await queryClient.ensureQueryData(ordersQuery(user.jwt, params));
      return { ...data };

    } catch (error) {
      console.error(error);
      toast({ description: 'Failed to fetch orders' });
      return null;
    }
  };
