import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail } from 'lucide-react';

export default function OnAuthSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/auth');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4" data-id="ziukli476" data-path="src/pages/OnAuthSuccessPage.tsx">
      <Card className="w-full max-w-md shadow-xl" data-id="4p4ut7p8b" data-path="src/pages/OnAuthSuccessPage.tsx">
        <CardHeader className="text-center space-y-4" data-id="4xpnkeisw" data-path="src/pages/OnAuthSuccessPage.tsx">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center" data-id="5xx74l991" data-path="src/pages/OnAuthSuccessPage.tsx">
            <CheckCircle className="h-8 w-8 text-green-600" data-id="r7eqsc5b9" data-path="src/pages/OnAuthSuccessPage.tsx" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-green-800" data-id="pk9r9dms0" data-path="src/pages/OnAuthSuccessPage.tsx">
            Email Verified Successfully!
          </CardTitle>
          <CardDescription className="text-center" data-id="s2r5sdspk" data-path="src/pages/OnAuthSuccessPage.tsx">
            Your email has been verified and your account is now active.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center" data-id="dznx8fdlg" data-path="src/pages/OnAuthSuccessPage.tsx">
          <div className="space-y-2" data-id="b23zpo9u9" data-path="src/pages/OnAuthSuccessPage.tsx">
            <div className="flex items-center justify-center gap-2 text-blue-600" data-id="yxxuj7vs6" data-path="src/pages/OnAuthSuccessPage.tsx">
              <Mail className="h-5 w-5" data-id="w9zt6ouqf" data-path="src/pages/OnAuthSuccessPage.tsx" />
              <span className="font-medium" data-id="3n6kr8lws" data-path="src/pages/OnAuthSuccessPage.tsx">Email Verification Complete</span>
            </div>
            <p className="text-sm text-gray-600" data-id="aymerpigf" data-path="src/pages/OnAuthSuccessPage.tsx">
              You can now login to your account and start using our platform.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-id="vnci5ojx5" data-path="src/pages/OnAuthSuccessPage.tsx">
            <p className="text-blue-800 font-medium" data-id="yqdml10xn" data-path="src/pages/OnAuthSuccessPage.tsx">
              Redirecting to login page in {countdown} seconds...
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2" data-id="ekh34kyzx" data-path="src/pages/OnAuthSuccessPage.tsx">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(5 - countdown) / 5 * 100}%` }} data-id="an0zupxv4" data-path="src/pages/OnAuthSuccessPage.tsx">
              </div>
            </div>
          </div>
          
          <div className="text-center" data-id="rbv9xo03o" data-path="src/pages/OnAuthSuccessPage.tsx">
            <button
              onClick={() => navigate('/auth')}
              className="text-blue-600 hover:text-blue-800 font-medium underline" data-id="tobm2gsvc" data-path="src/pages/OnAuthSuccessPage.tsx">

              Go to login page now
            </button>
          </div>
        </CardContent>
      </Card>
    </div>);

}