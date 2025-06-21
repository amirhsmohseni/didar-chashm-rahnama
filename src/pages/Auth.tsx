
import { useState, useEffect } from 'react';
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
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
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

  // Security: Block mechanism for failed login attempts
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts');
    const lastAttemptTime = localStorage.getItem('lastLoginAttempt');
    
    if (storedAttempts && lastAttemptTime) {
      const attempts = parseInt(storedAttempts);
      const lastTime = parseInt(lastAttemptTime);
      const now = Date.now();
      const timeDiff = now - lastTime;
      
      // Block for 15 minutes after 5 failed attempts
      if (attempts >= 5 && timeDiff < 15 * 60 * 1000) {
        setIsBlocked(true);
        setLoginAttempts(attempts);
        setBlockTimeRemaining(Math.ceil((15 * 60 * 1000 - timeDiff) / 1000));
        
        const timer = setInterval(() => {
          setBlockTimeRemaining(prev => {
            if (prev <= 1) {
              setIsBlocked(false);
              setLoginAttempts(0);
              localStorage.removeItem('loginAttempts');
              localStorage.removeItem('lastLoginAttempt');
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      } else if (timeDiff >= 15 * 60 * 1000) {
        // Reset after 15 minutes
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastLoginAttempt');
        setLoginAttempts(0);
      } else {
        setLoginAttempts(attempts);
      }
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Enhanced password validation
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && (hasUpperCase || hasLowerCase) && (hasNumbers || hasSpecial),
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecial
    };
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
      else {
        const passwordValidation = validatePassword(signupPassword);
        if (!passwordValidation.isValid) {
          newErrors.password = 'رمز عبور باید حداقل 8 حرف و شامل حروف و اعداد باشد';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());
    localStorage.setItem('lastLoginAttempt', Date.now().toString());
    
    if (newAttempts >= 5) {
      setIsBlocked(true);
      setBlockTimeRemaining(15 * 60); // 15 minutes
      toast({
        title: "حساب مسدود شد",
        description: "به دلیل تلاش‌های مکرر ناموفق، حساب شما برای 15 دقیقه مسدود شد",
        variant: "destructive",
      });
    } else {
      toast({
        title: "ورود ناموفق",
        description: `تلاش ${newAttempts} از 5. پس از 5 تلاش ناموفق حساب شما مسدود می‌شود.`,
        variant: "destructive",
      });
    }
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        title: "حساب مسدود",
        description: `لطفا ${Math.ceil(blockTimeRemaining / 60)} دقیقه صبر کنید`,
        variant: "destructive",
      });
      return;
    }
    
    if (!validateForm(true)) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        console.error('Login error:', error);
        handleFailedLogin();
        
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
        // Reset login attempts on successful login
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastLoginAttempt');
        setLoginAttempts(0);
        
        toast({
          title: "ورود موفق",
          description: "با موفقیت وارد شدید",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login exception:', error);
      handleFailedLogin();
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
        console.error('Signup error:', error);
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
      console.error('Signup exception:', error);
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
                
                {/* Security Status Display */}
                {loginAttempts > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    {isBlocked ? (
                      <p>حساب مسدود - {Math.ceil(blockTimeRemaining / 60)} دقیقه تا آزادسازی</p>
                    ) : (
                      <p>تلاش‌های ناموفق: {loginAttempts}/5</p>
                    )}
                  </div>
                )}
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
                          disabled={isBlocked}
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
                          disabled={isBlocked}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                          disabled={isBlocked}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || isBlocked}>
                      {isLoading ? 'در حال ورود...' : isBlocked ? `مسدود شده (${Math.ceil(blockTimeRemaining / 60)} دقیقه)` : 'ورود'}
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
                      
                      {/* Password strength indicator */}
                      {signupPassword && (
                        <div className="mt-2 text-xs text-gray-600">
                          <p>رمز عبور باید شامل:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li className={validatePassword(signupPassword).minLength ? 'text-green-600' : 'text-red-600'}>
                              حداقل 8 حرف
                            </li>
                            <li className={validatePassword(signupPassword).hasNumbers || validatePassword(signupPassword).hasSpecial ? 'text-green-600' : 'text-red-600'}>
                              حروف و اعداد یا نمادها
                            </li>
                          </ul>
                        </div>
                      )}
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
                    disabled={isBlocked}
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
