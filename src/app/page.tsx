"use client"

// import Image from 'next/image'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useState } from "react"

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
})

export default function Home() {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true)
    try {
      const res = await axios.post('/api/invite', values)

      setMessage(res.data.message)
    } catch (error) {
      console.log(error)

      setMessage("An error occurred while trying to send invite, please try again later.")
    }
    setSubmitting(false)
    form.reset();
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-between md:py-24 py-12 px-2">
      <div className="flex flex-1 flex-col z-10 max-w-md w-full items-center justify-center font-mono text-sm border rounded px-4 py-16">
        <h1 className="mb-4 text-xl font-semibold">
          👋🏾 Hello Data Analyst
        </h1>
        <p className="mb-8 text-center px-8">
          Request invite to the <a href="https://app.regendata.xyz" className="underline underline-offset-2" target="_blank">Regendata</a> metabase instance to play around with Gitcoin grants data.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input placeholder="Anon" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input placeholder="Hunter" {...field} />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@email.com" {...field} />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <div className="w-full flex flex-1 flex-col items-center justify-center space-y-2">
              <Button size="lg" className="w-full" type="submit" disabled={submitting}>
                {submitting ? "Sending invite..." : "Submit"}
              </Button>
              {message.length > 0 && <span>{message}</span>}
            </div>
          </form>
        </Form>

        <div className="mt-8">Already have an account? <a className="underline underline-offset-2" href="https://app.regendata.xyz">Sign in</a></div>
      </div>
    </main>
  )
}
