import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Phone, MessageSquare } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const { login, register, loginWithPhone, registerWithPhone, sendOTP } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Timer for OTP resend
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validatePhoneNumber = (phone: string) => {
    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast({
        title: 'Error',
        description: 'Please enter your phone number',
        variant: 'destructive'
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid phone number',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOTP(phoneNumber);
      if (result.success) {
        setOtpSent(true);
        setOtpTimer(60); // 60 seconds timer
        toast({
          title: 'OTP Sent',
          description: 'Please check your phone for the verification code. For demo purposes, check the browser console.'
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send OTP',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Logged in successfully!'
          });
          navigate(from, { replace: true });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Login failed',
            variant: 'destructive'
          });
        }
      } else {
        const result = await register(email, password, name);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Account created successfully! Please check your email for verification.'
          });
          setIsLogin(true);
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Registration failed',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Authentication failed',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent) {
      await handleSendOTP();
      return;
    }

    if (!otpCode) {
      toast({
        title: 'Error',
        description: 'Please enter the OTP code',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const result = await loginWithPhone(phoneNumber, otpCode);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Logged in successfully!'
          });
          navigate(from, { replace: true });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Login failed',
            variant: 'destructive'
          });
        }
      } else {
        const result = await registerWithPhone(phoneNumber, name);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Account created successfully! You can now login with your phone number.'
          });
          setIsLogin(true);
          setOtpSent(false);
          setOtpCode('');
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Registration failed',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Authentication failed',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhoneNumber('');
    setOtpCode('');
    setOtpSent(false);
    setOtpTimer(0);
    setShowPassword(false);
  };

  const switchAuthMode = (newIsLogin: boolean) => {
    setIsLogin(newIsLogin);
    resetForm();
  };

  const switchAuthMethod = (method: 'email' | 'phone') => {
    setAuthMethod(method);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ?
            'Sign in to your account to continue' :
            'Sign up to start shopping with us'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs value={authMethod} onValueChange={(value) => switchAuthMethod(value as 'email' | 'phone')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4 mt-4">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {!isLogin &&
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin} />

                  </div>
                }
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />

                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}>

                      {showPassword ?
                      <EyeOff className="h-4 w-4" /> :

                      <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4 mt-4">
              <form onSubmit={handlePhoneAuth} className="space-y-4">
                {!isLogin &&
                <div className="space-y-2">
                    <Label htmlFor="phone-name">Full Name</Label>
                    <Input
                    id="phone-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin} />

                  </div>
                }
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={otpSent && otpTimer > 0} />

                </div>
                
                {otpSent &&
                <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    required />

                    <p className="text-sm text-gray-600">
                      Code sent to {phoneNumber}
                      {otpTimer > 0 && ` • Resend in ${otpTimer}s`}
                    </p>
                  </div>
                }
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading}>

                    {isLoading ? 'Processing...' :
                    !otpSent ? 'Send OTP' : isLogin ? 'Verify & Sign In' : 'Verify & Sign Up'
                    }
                  </Button>
                  
                  {otpSent && otpTimer === 0 &&
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendOTP}
                    disabled={isLoading}>

                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  }
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2">
            <Separator />
            <div className="text-center text-sm text-gray-600">
              <strong>Demo Admin Access:</strong>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('admin123');
                setAuthMethod('email');
                setIsLogin(true);
              }}>

              Quick Admin Login
            </Button>
            <div className="text-center text-xs text-gray-500 space-y-1">
              <div>Or any email containing "admin" with password "admin123"</div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <div className="text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => switchAuthMode(!isLogin)}>

              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>);

}
