"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({ className, ...props }: UserRegisterFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [passwordRepeated, setPasswordRepeated] = React.useState<string>('')
  const [username, setUsername] = React.useState<string>("")
  const [isOpened, setIsOpened] = React.useState<boolean>(false)


  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsOpened(false)
    setIsLoading(true)
    if (!email || !password) return setError('Invalid e-mail or password.')
    if (password !== passwordRepeated) return setError('Passwords do not match.')
    const request = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password,
        passwordRepeated
      })
    })
    const response = await request.json()
    if (request.status === 400) {
      setIsLoading(false)
      setError(response.error)
    } else {
      setIsOpened(true)
      setIsLoading(false)
      setTimeout(() => {
      window.location.href = 'http://localhost:3000/login'
      }, 4500)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <AlertDialog open={isOpened}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Success!</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your account has been created successfully!<br />
            You will be redirect to login...
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
            <Label className="sr-only" htmlFor="email">
              Username
            </Label>
            <Input
              id="username"
              placeholder="johndoe123"
              type="username"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <Label className="sr-only" htmlFor="passwordRepeated">
              Repeat password
            </Label>
            <Input
              id="passwordRepeated"
              placeholder="repeat your password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              value={passwordRepeated}
              onChange={(e) => setPasswordRepeated(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading} className="mt-4 bg-[#111111] shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)]">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
          <a href="/login" className="text-muted-foreground text-gray-100 text-xs text-center">Already have an account? Sign in!</a>
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