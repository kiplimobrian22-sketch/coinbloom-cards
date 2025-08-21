import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { countries, getCurrencyByCountry } from '@/data/countries';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  country: z.string().min(1, 'Please select your country'),
  referralCode: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signUp, signIn } = useAuth();
  const { toast } = useToast();
  const { countryCode, loading: geoLoading } = useGeolocation();

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      country: '',
      referralCode: '',
      acceptTerms: false,
    },
  });

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Set detected country when geolocation loads
  useEffect(() => {
    if (!geoLoading && countryCode && !signUpForm.getValues('country')) {
      signUpForm.setValue('country', countryCode);
    }
  }, [countryCode, geoLoading, signUpForm]);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      const currency = getCurrencyByCountry(data.country);
      
      const { error } = await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        country: data.country,
        currency,
        referral_code: data.referralCode,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message || "Please try again",
        });
      } else {
        toast({
          title: "Welcome to GiftcardsHub!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message || "Please check your credentials",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">GiftcardsHub</h1>
            </div>
            <p className="text-muted-foreground">Your trusted gift card marketplace</p>
          </div>

          <Card>
            <CardHeader className="text-center pb-4">
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Sign up or sign in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                </TabsList>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...signUpForm.register('firstName')}
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...signUpForm.register('lastName')}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...signUpForm.register('email')}
                        placeholder="your@email.com"
                      />
                      {signUpForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {signUpForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        {...signUpForm.register('password')}
                        placeholder="Minimum 6 characters"
                      />
                      {signUpForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {signUpForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...signUpForm.register('confirmPassword')}
                        placeholder="Confirm your password"
                      />
                      {signUpForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">
                          {signUpForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={signUpForm.watch('country')}
                        onValueChange={(value) => signUpForm.setValue('country', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={geoLoading ? "Detecting location..." : "Select your country"}>
                            {signUpForm.watch('country') && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {countries.find(c => c.code === signUpForm.watch('country'))?.flag}
                                {countries.find(c => c.code === signUpForm.watch('country'))?.name}
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <div className="flex items-center gap-2">
                                {country.flag} {country.name} ({country.currency})
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {signUpForm.formState.errors.country && (
                        <p className="text-sm text-destructive mt-1">
                          {signUpForm.formState.errors.country.message}
                        </p>
                      )}
                      {signUpForm.watch('country') && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Your account will be created with {getCurrencyByCountry(signUpForm.watch('country'))} currency
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="referralCode">Referral Code</Label>
                      <Input
                        id="referralCode"
                        {...signUpForm.register('referralCode')}
                        placeholder="Optional - Enter code from friend"
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={signUpForm.watch('acceptTerms')}
                        onCheckedChange={(checked) => signUpForm.setValue('acceptTerms', checked as boolean)}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm leading-5">
                        I accept the{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                        *
                      </Label>
                    </div>
                    {signUpForm.formState.errors.acceptTerms && (
                      <p className="text-sm text-destructive">
                        {signUpForm.formState.errors.acceptTerms.message}
                      </p>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    <Alert>
                      <AlertDescription className="text-sm">
                        🎉 New users get a welcome bonus in their local currency after verification!
                      </AlertDescription>
                    </Alert>
                  </form>
                </TabsContent>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div>
                      <Label htmlFor="signinEmail">Email</Label>
                      <Input
                        id="signinEmail"
                        type="email"
                        {...signInForm.register('email')}
                        placeholder="your@email.com"
                      />
                      {signInForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {signInForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="signinPassword">Password</Label>
                      <Input
                        id="signinPassword"
                        type="password"
                        {...signInForm.register('password')}
                        placeholder="Your password"
                      />
                      {signInForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {signInForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}