"use client";

import { useState } from "react";
import { Truck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, getAuthErrorMessage, AuthError } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Password requirements
  const passwordRequirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "At least one uppercase letter" },
    { regex: /[a-z]/, text: "At least one lowercase letter" },
    { regex: /[0-9]/, text: "At least one number" },
    { regex: /[^A-Za-z0-9]/, text: "At least one special character" },
  ];

  const validatePassword = (password: string) => {
    const failedRequirements = passwordRequirements.filter(
      (requirement) => !requirement.regex.test(password)
    );
    return failedRequirements.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(formData.password)) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (!response.success) {
        throw response.error;
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      setError(getAuthErrorMessage(err as AuthError));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-2xl font-bold"
            >
              <Truck className="h-6 w-6" />
              <span>Sova</span>
            </Link>
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your information to get started
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password Requirements</Label>
                  <ul className="text-sm space-y-1">
                    {passwordRequirements.map((requirement, index) => (
                      <li
                        key={index}
                        className={`flex items-center space-x-2 ${
                          requirement.regex.test(formData.password)
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="text-xs">
                          {requirement.regex.test(formData.password)
                            ? "✓"
                            : "○"}
                        </span>
                        <span>{requirement.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      <footer className="py-6 w-full border-t">
        <div className="container flex flex-col gap-2 sm:flex-row items-center px-4 sm:px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sova. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
