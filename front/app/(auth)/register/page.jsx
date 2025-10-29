import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - Baraka',
  description: 'Create a new Baraka account',
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h1>
      <p className="text-gray-600 mb-8 text-center">Sign up to get started</p>
      <RegisterForm />
    </div>
  );
}

