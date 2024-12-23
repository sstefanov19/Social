"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const [userAdded, setUserAdded] = useState(false);
  const [searchTerm , setSearchTerm] = useState('');
  const router = useRouter();

  async function addUser() {
    if (isSignedIn && user && !userAdded) {
      try {
        const checkResponse = await fetch(`/api/users?userId=${user.id}`, {
          method: "GET",
        });

        if (checkResponse.status === 404) {
          const response = await fetch("/api/addUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
              userId: user.id,
              name: user.fullName ?? "",
              email: user.primaryEmailAddress?.emailAddress ?? "",
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to add user to database");
          }

          setUserAdded(true);
        } else if (checkResponse.ok) {
          setUserAdded(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if (isSignedIn && user && !userAdded) {
      void addUser();
    }
  }, [isSignedIn, user, userAdded]);

  const handleKeyPress = (e : React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
        router.push(`/posts/${searchTerm}`)
    }
  }

  return (
    <header className="fixed top-0  w-full  bg-[#1B262C] p-3 z-50">
      <div className="flex justify-between">
        <Link href="/">
          <h1 className="text-bold text-3xl text-slate-200">DevBlog</h1>
        </Link>
        <input
          type="text"
          placeholder="Search for a topic..."
          className="mx-2 w-[100px] rounded-md border-2 border-slate-300 p-2 md:ml-20 md:w-[300px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <nav>
          <ul className="flex md:gap-4 gap-2">
            <li>
              {isSignedIn && user && (
                <Link className="text-slate-200" href={`/profile/${user.fullName}`}>                  Profile
                </Link>
              )}
            </li>
            <li>
              {isSignedIn && (
                <Link className="text-slate-200" href="/create-post">
                  Create post
                </Link>
              )}
            </li>
            <li className="text-slate-200">
              {isSignedIn ? <SignOutButton /> : <SignInButton />}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
