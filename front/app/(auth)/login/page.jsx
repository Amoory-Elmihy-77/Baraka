import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - Baraka',
  description: 'Login to your Baraka account',
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h1>
      <p className="text-gray-600 mb-8 text-center">Login to continue to your dashboard</p>
      <LoginForm />
    </div>
  );
}

