import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast({
        title: 'Invalid Reset Link',
        description: 'The password reset link is invalid or has expired.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }
    setToken(tokenParam);
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await window.ezsite.apis.resetPassword({
        token,
        password
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: 'Success',
        description: 'Your password has been reset successfully! You can now login with your new password.'
      });

      navigate('/auth');
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset password. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4" data-id="pxujyr4ea" data-path="src/pages/ResetPasswordPage.tsx">
      <Card className="w-full max-w-md shadow-xl" data-id="f083v3me4" data-path="src/pages/ResetPasswordPage.tsx">
        <CardHeader className="space-y-1" data-id="5wt8o1t9q" data-path="src/pages/ResetPasswordPage.tsx">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4" data-id="v9lcmvmvx" data-path="src/pages/ResetPasswordPage.tsx">
            <Lock className="h-6 w-6 text-blue-600" data-id="nvw3efkjv" data-path="src/pages/ResetPasswordPage.tsx" />
          </div>
          <CardTitle className="text-2xl font-bold text-center" data-id="w954l82j6" data-path="src/pages/ResetPasswordPage.tsx">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-center" data-id="5j75npuj3" data-path="src/pages/ResetPasswordPage.tsx">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        
        <CardContent data-id="o3nlyjizr" data-path="src/pages/ResetPasswordPage.tsx">
          <form onSubmit={handleSubmit} className="space-y-4" data-id="srka5v7po" data-path="src/pages/ResetPasswordPage.tsx">
            <div className="space-y-2" data-id="elsvs39rl" data-path="src/pages/ResetPasswordPage.tsx">
              <Label htmlFor="password" data-id="2v1qksw43" data-path="src/pages/ResetPasswordPage.tsx">New Password</Label>
              <div className="relative" data-id="8udpuhu27" data-path="src/pages/ResetPasswordPage.tsx">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10" data-id="ftbb1xc0v" data-path="src/pages/ResetPasswordPage.tsx" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)} data-id="oovc9h1cg" data-path="src/pages/ResetPasswordPage.tsx">

                  {showPassword ?
                  <EyeOff className="h-4 w-4" data-id="bzeahrtug" data-path="src/pages/ResetPasswordPage.tsx" /> :

                  <Eye className="h-4 w-4" data-id="ov7nm69wp" data-path="src/pages/ResetPasswordPage.tsx" />
                  }
                </Button>
              </div>
            </div>
            
            <div className="space-y-2" data-id="wtyeiabnt" data-path="src/pages/ResetPasswordPage.tsx">
              <Label htmlFor="confirmPassword" data-id="8fod644kl" data-path="src/pages/ResetPasswordPage.tsx">Confirm New Password</Label>
              <div className="relative" data-id="3jdn5hr1d" data-path="src/pages/ResetPasswordPage.tsx">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10" data-id="2o6df7bjv" data-path="src/pages/ResetPasswordPage.tsx" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} data-id="pxbdztwf6" data-path="src/pages/ResetPasswordPage.tsx">

                  {showConfirmPassword ?
                  <EyeOff className="h-4 w-4" data-id="7iyg709gu" data-path="src/pages/ResetPasswordPage.tsx" /> :

                  <Eye className="h-4 w-4" data-id="ic7g7jrp2" data-path="src/pages/ResetPasswordPage.tsx" />
                  }
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg" data-id="sf3jl99bw" data-path="src/pages/ResetPasswordPage.tsx">
              <p className="font-medium mb-1" data-id="kmzrmitxu" data-path="src/pages/ResetPasswordPage.tsx">Password requirements:</p>
              <ul className="text-xs space-y-1" data-id="p2u736gxz" data-path="src/pages/ResetPasswordPage.tsx">
                <li data-id="fqttt7lid" data-path="src/pages/ResetPasswordPage.tsx">• At least 6 characters long</li>
                <li data-id="f81a0nd72" data-path="src/pages/ResetPasswordPage.tsx">• Must match the confirmation password</li>
              </ul>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading} data-id="keqvwxn48" data-path="src/pages/ResetPasswordPage.tsx">
              {isLoading ?
              <div className="flex items-center gap-2" data-id="oxhexqaz2" data-path="src/pages/ResetPasswordPage.tsx">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-id="rexn096lj" data-path="src/pages/ResetPasswordPage.tsx"></div>
                  Resetting Password...
                </div> :

              'Reset Password'
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center" data-id="yenzp6h5x" data-path="src/pages/ResetPasswordPage.tsx">
            <button
              onClick={() => navigate('/auth')}
              className="text-sm text-blue-600 hover:text-blue-800 underline" data-id="8ncipqugi" data-path="src/pages/ResetPasswordPage.tsx">

              Back to login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>);

}