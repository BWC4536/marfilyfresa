"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for the confirmation link.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-10 shadow-xl transition-all duration-300">
        <h2 className="font-serif text-3xl font-bold text-center text-mf-charcoal mb-8">
          {isLogin ? "Welcome Back" : "Join MarfilYFresa"}
        </h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-mf-charcoal/80 mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-mf-primary transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mf-charcoal/80 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-mf-primary transition-all duration-300"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-mf-charcoal text-mf-background font-semibold py-3 rounded-full hover:bg-gray-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-mf-charcoal/70">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-500 font-semibold hover:underline transition-all"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}