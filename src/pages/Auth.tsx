
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');

  // Validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (isLoginForm: boolean) => {
    const newErrors: {[key: string]: string} = {};

    if (isLoginForm) {
      if (!loginEmail) newErrors.email = 'ایمیل الزامی است';
      else if (!validateEmail(loginEmail)) newErrors.email = 'ایمیل معتبر نیست';
      
      if (!loginPassword) newErrors.password = 'رمز عبور الزامی است';
      else if (loginPassword.length < 6) newErrors.password = 'رمز عبور باید حداقل 6 حرف باشد';
    } else {
      if (!signupFullName) newErrors.fullName = 'نام و نام خانوادگی الزامی است';
      else if (signupFullName.length < 2) newErrors.fullName = 'نام باید حداقل 2 حرف باشد';
      
      if (!signupEmail) newErrors.email = 'ایمیل الزامی است';
      else if (!validateEmail(signupEmail)) newErrors.email = 'ایمیل معتبر نیست';
      
      if (!signupPassword) newErrors.password = 'رمز عبور الزامی است';
      else if (signupPassword.length < 6) newErrors.password = 'رمز عبور باید حداقل 6 حرف باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(true)) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "خطا در ورود",
            description: "ایمیل یا رمز عبور اشتباه است",
            variant: "destructive",
          });
        } else {
          toast({
            title: "خطا در ورود",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "ورود موفق",
          description: "با موفقیت وارد شدید",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) return;
    
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupFullName,
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "خطا در ثبت نام",
            description: "این ایمیل قبلاً ثبت شده است",
            variant: "destructive",
          });
        } else {
          toast({
            title: "خطا در ثبت نام",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "ثبت نام موفق",
          description: "با موفقیت ثبت نام شدید",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <div className="bg-secondary min-h-screen">
        <div className="container py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {isLogin ? 'ورود به حساب کاربری' : 'ثبت نام'}
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? 'برای ورود به پنل مدیریت، اطلاعات خود را وارد کنید'
                    : 'برای ساخت حساب کاربری، فرم زیر را تکمیل کنید'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLogin ? (
                  <form onSubmit={onLogin} className="space-y-4">
                    <div>
                      <label htmlFor="login-email" className="block text-sm font-medium mb-1">
                        ایمیل
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="login-email"
                          type="email"
                          placeholder="example@gmail.com" 
                          className="pr-9"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="login-password" className="block text-sm font-medium mb-1">
                        رمز عبور
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="رمز عبور خود را وارد کنید"
                          className="pr-9 pl-9"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'در حال ورود...' : 'ورود'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={onSignup} className="space-y-4">
                    <div>
                      <label htmlFor="signup-fullname" className="block text-sm font-medium mb-1">
                        نام و نام خانوادگی
                      </label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-fullname"
                          type="text"
                          placeholder="نام و نام خانوادگی خود را وارد کنید" 
                          className="pr-9"
                          value={signupFullName}
                          onChange={(e) => setSignupFullName(e.target.value)}
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium mb-1">
                        ایمیل
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-email"
                          type="email"
                          placeholder="example@gmail.com" 
                          className="pr-9"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium mb-1">
                        رمز عبور
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="رمز عبور خود را وارد کنید"
                          className="pr-9 pl-9"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'در حال ثبت نام...' : 'ثبت نام'}
                    </Button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-primary hover:underline"
                  >
                    {isLogin 
                      ? 'حساب کاربری ندارید؟ ثبت نام کنید'
                      : 'قبلاً ثبت نام کرده‌اید؟ وارد شوید'
                    }
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Auth;
