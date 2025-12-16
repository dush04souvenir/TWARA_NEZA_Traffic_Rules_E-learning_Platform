"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { registerUser } from "@/lib/actions/auth-actions"
import { toast } from "sonner"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Basic sanitization
    const trimmedEmail = email.trim()

    try {
      if (isLogin) {
        // Handle Login
        const result = await signIn("credentials", {
          email: trimmedEmail,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast.error("Invalid credentials")
          setPassword("") // Clear sensitive input on failure
        } else {
          toast.success("Logged in successfully")
          onClose()

          // Check session to determine redirect
          const session = await getSession()
          const role = session?.user?.role as string | undefined

          if (role === "ADMIN") {
            router.push("/admin-dashboard")
          } else if (role === "MANAGER") {
            router.push("/manager-dashboard")
          } else {
            router.push("/learner-dashboard")
          }

          router.refresh()
        }
      } else {
        // Handle Registration
        const result = await registerUser({ name, email: trimmedEmail, password })

        if (result.error) {
          toast.error(result.error)
          setPassword("") // Clear password on error
        } else {
          toast.success("Account created! Please login.")
          setIsLogin(true) // Switch to login view
          setPassword("") // Clear password to force re-entry
        }
      }
    } catch (error) {
      toast.error("Something went wrong")
      setPassword("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>{isLogin ? "Login to TWARA NEZA" : "Create Account"}</CardTitle>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">
              ×
            </button>
          </div>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Register to start learning traffic rules"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold"
            >
              {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
