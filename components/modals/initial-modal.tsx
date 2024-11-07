"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";

export const InitialModal = () => {
  const [isMounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const schema = z.object({
    inviteLink: z.string().url({
      message: "Please enter a valid URL",
    }),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      inviteLink: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      // Navigate to the URL if valid
      window.location.href = values.inviteLink;
    } catch (error) {
      alert("Invalid Invitation Link");
    }
  };

  if (!isMounted) {
    return null;
  }
  
  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Join a Server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Enter an invite below to join an existing server
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-6">
            <FormField
              control={form.control}
              name="inviteLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Invite Link *
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      placeholder="https://scholarly-rwanda.vercel.app/invite/af8f9f4d-4fd0-412c-889a-0b42845133a0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="primary" disabled={isLoading}>
                Join Server
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
