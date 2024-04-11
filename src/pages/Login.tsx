import {
  Form,
  Link,
  redirect,
  type ActionFunction,
  useNavigate,
} from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubmitBtn, FormInput } from '@/components';
import { customFetch } from '@/utils';
import { toast } from '@/components/ui/use-toast';
import { type ReduxStore } from '@/store';
import { loginUser } from '@/features/user/userSlice';
import { useAppDispatch } from '@/hooks';
import { AxiosResponse } from 'axios';

/* 
* login normal user
* in this case we can't use the hook dispatch(loginUser({ username, jwt })) directly inside the
* action function as we did in loginAsGuestUser(), so we need to return a new function to dispatch 
* inside the action function and pass the store as an argument
*/
export const action = (store: ReduxStore): ActionFunction => async ({ request }): Promise<Response | null> => {
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

function Login() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //login with GUESS USER
  const loginAsGuestUser = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await customFetch.post('/auth/local', {
        identifier: 'test@test.com',
        password: 'secret',
      });

      const username = response.data.user.username;
      const jwt = response.data.jwt;

      dispatch(loginUser({ username, jwt }));
      navigate('/');

    } catch (error: any) {
      console.log(error.message);
      toast({description: 'Login failed'});
    }
    
  };


  return (
    <section className='h-screen grid place-items-center'>
      <Card className='w-96 bg-muted'>
        <CardHeader>
          <CardTitle className='text-center'>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <Form method='POST'>
            <FormInput type='email' label='email' name='identifier' />
            <FormInput type='password' name='password' />

            {/* SUBMIT BUTTON */}
            <SubmitBtn text='Login' className='w-full mt-4' />

            {/* GUESS USER BUTTON */}
            <Button
              type='button'
              variant='outline'
              onClick={loginAsGuestUser}
              className='w-full mt-4'
            >
              Guest User
            </Button>

            <p className='text-center mt-4'>
              Not a member yet?
              <Button type='button' asChild variant='link'>
                <Link to='/register'>Register</Link>
              </Button>
            </p>
          </Form>
        </CardContent>

      </Card>
    </section>
  )
}
export default Login;
