"use client"
import React, { useEffect } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";


export default function Header() {
  const { isSignedIn , user } = useUser();


  useEffect(() => {
    async function addUser() {
      if (isSignedIn && user) {
        try {
          const response = await fetch('/api/addUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              name: user.fullName ?? "",
              email: user?.emailAddresses[0]?.emailAddress,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to add user to database');
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    void addUser()
  }, [isSignedIn, user]);



  return (
    <header className="fixed top-0 mt-4 w-full p-3">
      <div className="flex justify-between">
        <Link href="/">
        <h1 className="text-bold text-3xl text-slate-200">DevBlog</h1>
        </Link>
        <input
          type="text"
          placeholder="Search for a topic..."
          className="w-[300px] border-2 border-slate-300 p-2 ml-20 rounded-md"
        />
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link className="text-slate-200" href="/profile">
                Profile
              </Link>
            </li>
            <li>
                {isSignedIn && <Link className="text-slate-200" href="/create-post">Create post</Link>}
            </li>
            <li className="text-slate-200">
              {isSignedIn ? <UserButton /> : <SignInButton />}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
