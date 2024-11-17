"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const [userAdded, setUserAdded] = useState(false);


  async function addUser() {
    if (isSignedIn && user && userAdded) {
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
                userId: user.id,
                name: user.fullName ?? "",
                email: user?.emailAddresses[0]?.emailAddress,
              }),
            });
          if (!response.ok) {
            throw new Error("Failed to add user to database");
          }

          setUserAdded(true);
        } else {
          setUserAdded(true);
        }
      } catch (error) {
    console.error(error);
      }
    }
  }


  useEffect(() => {
    if (isSignedIn && user && userAdded) {
      void addUser();
    }
  }, [isSignedIn, user, userAdded]);

  return (
    <header className="fixed top-0 mt-4 w-full p-3">
      <div className="flex justify-between">
        <Link href="/">
          <h1 className="text-bold text-3xl text-slate-200">DevBlog</h1>
        </Link>
        <input
          type="text"
          placeholder="Search for a topic..."
          className="ml-2 w-[100px] rounded-md border-2 border-slate-300 p-2 md:ml-20 md:w-[300px]"
        />
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link className="text-slate-200" href="/profile">
                Profile
              </Link>
            </li>
            <li>
              {isSignedIn && (
                <Link className="text-slate-200" href="/create-post">
                  Create post
                </Link>
              )}
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
