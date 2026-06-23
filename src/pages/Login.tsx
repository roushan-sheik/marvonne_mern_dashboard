import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../store/apiSlice';
import { setCredentials } from '../store/authSlice';
import { BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMsg('');
      const res = await login(data).unwrap();
      dispatch(setCredentials({ user: res.data.user, token: res.data.accessToken }));
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0f3a4a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-4 backdrop-blur-sm border border-white/20">
          <BookOpen className="h-12 w-12 text-[#bef264]" />
        </div>
        <h2 className="mt-2 text-center text-4xl font-extrabold text-white tracking-tight">
          Dreamtales Admin
        </h2>
        <p className="mt-3 text-center text-lg text-gray-300 font-medium">
          Sign in to manage magical adventures
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/5 backdrop-blur-md py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-12 border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {errorMsg && (
              <div className="bg-red-500/20 text-red-200 text-sm p-4 rounded-2xl border border-red-500/30 text-center font-medium">
                {errorMsg}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-200"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-transparent sm:text-base transition-all"
                  placeholder="admin@dreamtales.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-200"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-transparent sm:text-base transition-all"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-lg text-base font-extrabold text-[#0a192f] bg-[#bef264] hover:bg-[#bef264]-hover focus:outline-none focus:ring-4 focus:ring-[#bef264]/30 disabled:opacity-70 transition-all hover:-translate-y-0.5"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Log In to Admin Panel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
