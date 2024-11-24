"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import {useForm } from 'react-hook-form';
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
import { z } from 'zod';
import { useUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';





const formSchema = z.object({
    name : z.string().nonempty("Name is required"),
    text : z.string().nonempty("Comment is required")
      });

    interface CommentsFormProps {
        postId : string;
        onCommentSubmit : () => void;
    }

export default function CommentsForm({ postId , onCommentSubmit }: CommentsFormProps) {


    const {user} = useUser();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name : '',
          text : ''
        },
      });


      const handleSubmit = async (data : {name : string , text : string }) => {
       try {


           const formData = new FormData();
           formData.append('name', data.name);
           formData.append('text', data.text);
           formData.append('postId', postId.toString());
           if (user?.id) {
            formData.append('user', user.id);
          }


           const response = await fetch('/api/comment', {
               method: 'POST',
               body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            revalidatePath('/');
            revalidatePath('/posts');
            onCommentSubmit();
        } catch (error) {
            console.log("Couldnt submit the comment" , error);}
      };


  return (
    <div>
          <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 h-[300px] w-[500px] text-slate-200">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-bold text-xl'>Name</FormLabel>
                        <FormControl>
                          <Input className='text-slate-200' placeholder="Enter Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-bold text-xl'>Comment</FormLabel>
                        <FormControl>
                          <Textarea className='text-slate-200 h-[200px]' placeholder="Enter Comment" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
    </div>
  )
}
