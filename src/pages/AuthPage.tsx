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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4" data-id="hv8syiznx" data-path="src/pages/AuthPage.tsx">
      <Card className="w-full max-w-md shadow-xl" data-id="3p94hu8o2" data-path="src/pages/AuthPage.tsx">
        <CardHeader className="space-y-1" data-id="vb0m50vct" data-path="src/pages/AuthPage.tsx">
          <CardTitle className="text-2xl font-bold text-center" data-id="23qeuyng0" data-path="src/pages/AuthPage.tsx">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center" data-id="4vje6grhk" data-path="src/pages/AuthPage.tsx">
            {isLogin ?
            'Sign in to your account to continue' :
            'Sign up to start shopping with us'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4" data-id="2ssxzx7aj" data-path="src/pages/AuthPage.tsx">
          <Tabs value={authMethod} onValueChange={(value) => switchAuthMethod(value as 'email' | 'phone')} data-id="lfdsonmxh" data-path="src/pages/AuthPage.tsx">
            <TabsList className="grid w-full grid-cols-2" data-id="hg9xynm44" data-path="src/pages/AuthPage.tsx">
              <TabsTrigger value="email" className="flex items-center gap-2" data-id="muimcnsej" data-path="src/pages/AuthPage.tsx">
                <Mail className="h-4 w-4" data-id="n9bgttlyp" data-path="src/pages/AuthPage.tsx" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2" data-id="3w3qte46q" data-path="src/pages/AuthPage.tsx">
                <Phone className="h-4 w-4" data-id="6zeolo8qm" data-path="src/pages/AuthPage.tsx" />
                Phone
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4 mt-4" data-id="0c5wets29" data-path="src/pages/AuthPage.tsx">
              <form onSubmit={handleEmailAuth} className="space-y-4" data-id="l3yi6kfl5" data-path="src/pages/AuthPage.tsx">
                {!isLogin &&
                <div className="space-y-2" data-id="qm8fwse11" data-path="src/pages/AuthPage.tsx">
                    <Label htmlFor="name" data-id="spa0r3v76" data-path="src/pages/AuthPage.tsx">Full Name</Label>
                    <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin} data-id="nfptnjyf6" data-path="src/pages/AuthPage.tsx" />

                  </div>
                }
                
                <div className="space-y-2" data-id="0rm7utjp4" data-path="src/pages/AuthPage.tsx">
                  <Label htmlFor="email" data-id="1kkyu8tmf" data-path="src/pages/AuthPage.tsx">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required data-id="9hps5mtq7" data-path="src/pages/AuthPage.tsx" />

                </div>
                
                <div className="space-y-2" data-id="wi1m83ear" data-path="src/pages/AuthPage.tsx">
                  <Label htmlFor="password" data-id="sy74ajag3" data-path="src/pages/AuthPage.tsx">Password</Label>
                  <div className="relative" data-id="gjz7fkigs" data-path="src/pages/AuthPage.tsx">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required data-id="v48i5riw2" data-path="src/pages/AuthPage.tsx" />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)} data-id="qp9yqprp3" data-path="src/pages/AuthPage.tsx">

                      {showPassword ?
                      <EyeOff className="h-4 w-4" data-id="w1cbkqa84" data-path="src/pages/AuthPage.tsx" /> :

                      <Eye className="h-4 w-4" data-id="pjqgl4l7o" data-path="src/pages/AuthPage.tsx" />
                      }
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading} data-id="xo9xrgp9i" data-path="src/pages/AuthPage.tsx">
                  {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4 mt-4" data-id="enpa73lot" data-path="src/pages/AuthPage.tsx">
              <form onSubmit={handlePhoneAuth} className="space-y-4" data-id="k9v3hb8zj" data-path="src/pages/AuthPage.tsx">
                {!isLogin &&
                <div className="space-y-2" data-id="702c0advh" data-path="src/pages/AuthPage.tsx">
                    <Label htmlFor="phone-name" data-id="pw0xzmdzp" data-path="src/pages/AuthPage.tsx">Full Name</Label>
                    <Input
                    id="phone-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin} data-id="h3lqu0dpd" data-path="src/pages/AuthPage.tsx" />

                  </div>
                }
                
                <div className="space-y-2" data-id="xvfgih1tl" data-path="src/pages/AuthPage.tsx">
                  <Label htmlFor="phone" data-id="kg86dsdm1" data-path="src/pages/AuthPage.tsx">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={otpSent && otpTimer > 0} data-id="jdu5twwt2" data-path="src/pages/AuthPage.tsx" />

                </div>
                
                {otpSent &&
                <div className="space-y-2" data-id="x011rjizz" data-path="src/pages/AuthPage.tsx">
                    <Label htmlFor="otp" data-id="ju7s6chwr" data-path="src/pages/AuthPage.tsx">Verification Code</Label>
                    <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    required data-id="vvsuh71hd" data-path="src/pages/AuthPage.tsx" />

                    <p className="text-sm text-gray-600" data-id="s4ayugf4g" data-path="src/pages/AuthPage.tsx">
                      Code sent to {phoneNumber}
                      {otpTimer > 0 && ` • Resend in ${otpTimer}s`}
                    </p>
                  </div>
                }
                
                <div className="flex gap-2" data-id="g7rfyw0o7" data-path="src/pages/AuthPage.tsx">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading} data-id="u69o3tu1x" data-path="src/pages/AuthPage.tsx">

                    {isLoading ? 'Processing...' :
                    !otpSent ? 'Send OTP' : isLogin ? 'Verify & Sign In' : 'Verify & Sign Up'
                    }
                  </Button>
                  
                  {otpSent && otpTimer === 0 &&
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendOTP}
                    disabled={isLoading} data-id="7xqs7bg6i" data-path="src/pages/AuthPage.tsx">

                      <MessageSquare className="h-4 w-4" data-id="bn6shj3td" data-path="src/pages/AuthPage.tsx" />
                    </Button>
                  }
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2" data-id="w46uz5eg4" data-path="src/pages/AuthPage.tsx">
            <Separator data-id="qjxowptgo" data-path="src/pages/AuthPage.tsx" />
            <div className="text-center text-sm text-gray-600" data-id="iusg6ii4b" data-path="src/pages/AuthPage.tsx">
              <strong data-id="g8xfv4cd7" data-path="src/pages/AuthPage.tsx">Demo Admin Access:</strong>
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
              }} data-id="wlswe82ab" data-path="src/pages/AuthPage.tsx">

              Quick Admin Login
            </Button>
            <div className="text-center text-xs text-gray-500 space-y-1" data-id="l29p6o1w3" data-path="src/pages/AuthPage.tsx">
              <div data-id="uk39rn8ju" data-path="src/pages/AuthPage.tsx">Or any email containing "admin" with password "admin123"</div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4" data-id="3jytx5bmz" data-path="src/pages/AuthPage.tsx">
          <Separator data-id="tg95m880y" data-path="src/pages/AuthPage.tsx" />
          <div className="text-center text-sm" data-id="xbi8dqcz9" data-path="src/pages/AuthPage.tsx">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => switchAuthMode(!isLogin)} data-id="e688hhfua" data-path="src/pages/AuthPage.tsx">

              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>);

}