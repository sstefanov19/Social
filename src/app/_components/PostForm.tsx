"use client";

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from '~/components/ui/button';
import { Input } from "~/components/ui/input";
import { Textarea } from '~/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '~/hooks/use-toast';

const formSchema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    imageUrl: z.any().optional(),
      });

  export default function PostForm() {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useUser();
    const [file , setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: '',
        description: '',
        imageUrl: null,
      },
    });

    const handleFormSubmit = async (data: { title: string; description: string; imageUrl?: File | null }) => {
      setLoading(true);
        try{
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      if (file) {
        formData.append('imageUrl', file);
      }
     if (user?.id) {
        formData.append('user', user.id);
      }
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

        if (!response.ok) {
          throw new Error("Failed to create post");
        }

        toast({
          title: 'Post created successfully',
        });
        router.push('/');
        console.log('Post created successfully');
      } catch (error) {
        console.error(error);
        toast({
          title: 'Failed to create post',
        });
      } finally {
        setLoading(false);
      }
    };

    if(loading) {
        return <div className='h-[1000px] text-center'>Loading...</div>
    }

    return (
            <div className='flex justify-center items-center mt-32 h-3/4 w-screen'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 text-slate-200">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-bold text-xl'>Title</FormLabel>
                        <FormControl>
                          <Input className='text-slate-200' placeholder="Enter Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-bold text-xl'>Description</FormLabel>
                        <FormControl>
                          <Textarea className='text-slate-200 h-[200px]' placeholder="Enter Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel className='font-bold text-xl'>Image</FormLabel>
                    <FormControl>
                      <input
                        className='text-slate-200'
                        type='file'
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setFile(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          );
        }
