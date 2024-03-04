"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { signIn } from "next-auth/react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    if(!email || !password) return setError('Invalid e-mail or password.')
    const signInResponse = await signIn('login', {
      username: email,
      password,
      redirect: false,
      callbackUrl: 'http://localhost:3000/'
    })
    if(signInResponse?.ok) {
      setIsLoading(false)
      window.location.href = 'http://localhost:3000/'
      return setError('')
    }
    setIsLoading(false)
    setError('Invalid e-mail or password.')
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {error !== '' && (
      <Alert className="text-red-500 bg-white">
      <CrossCircledIcon onClick={() => setError('')} className="h-4 w-4" />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
      )}
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-6">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading} className="mt-4 bg-[#111111] shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)]">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
          <a href="/register" className="text-muted-foreground text-gray-300 text-xs text-center">Don't have an account? Create one!</a>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-20 border-t absolute right-0" />
          <span className="w-20 border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-muted-foreground text-white">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}