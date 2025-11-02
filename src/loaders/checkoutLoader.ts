import { LoaderFunction, redirect } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { type ReduxStore } from '@/store';


//we use loader to restrict this route to authenticated users only
export const checkoutLoader = (store: ReduxStore): LoaderFunction => 
  async (): Promise<Response | null> => {
    
    const user = store.getState().userState.user;

    if (!user) {
      toast({ description: 'Please login to continue' });
      return redirect('/login');
    }

    return null;
  };