import { Link } from 'react-router-dom';
import { LoginForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';

export default function Login() {
  return (
    <AuthPageLayout>
      <LoginForm />
      <br />
      <Link
        to='/request-password-reset'
        className='block w-full rounded-md bg-gray-100 px-6 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-200'
      >
        Forgot your password? Reset it here
      </Link>
      <div className='mt-4 text-center text-sm text-gray-600'>
        Don't have an account?{' '}
        <Link to='/signup' className='text-blue-600 hover:text-blue-700'>
          Sign up
        </Link>
      </div>
    </AuthPageLayout>
  );
}
