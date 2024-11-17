import React from "react";
import {Button} from '~/components/ui/button';
import Link from 'next/link';
import { SignInButton, useUser } from "@clerk/nextjs";


export default function Introduction() {

    const { isSignedIn } = useUser();

  return <section className="h-1/3 flex justify-center items-center">

      <div className="flex flex-col items-center ">
        <h1 className="text-4xl text-center text-white font-semibold">Welcome to DevBlog</h1>
        <p className="text-center text-white">A place where developers share their thoughts and ideas</p>
        <Link href="/create-post">
        {isSignedIn ?
        <Button className="mt-4">Share your thoughts</Button>
        :
        <button className="text-zinc-200 border-2 rounded w-[60px] mt-2">
            <SignInButton>Sign in </SignInButton>
        </button>
        }
        </Link>
      </div>
  </section>;
}
