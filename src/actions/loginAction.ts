import { redirect, type ActionFunction } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { type ReduxStore } from '@/store';
import { customFetch } from '@/utils';
import { loginUser } from '@/features/user/userSlice';
import { toast } from '@/components/ui/use-toast';


export const loginAction = (store: ReduxStore): ActionFunction => async ({ request }): Promise<Response | null> => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response: AxiosResponse = await customFetch.post('/auth/local', data);
    const user = response.data.user.username;
    const jwt = response.data.jwt;
    //now we can dispatch the loginUser action L20 comment
    store.dispatch(loginUser({ username: user, jwt }));
    return redirect('/');
    
  } catch (error: any) {
    console.log(error.message);
    toast({description: 'Login Failed'});
  }

  return null;
}