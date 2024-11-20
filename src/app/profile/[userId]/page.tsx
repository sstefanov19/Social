"use client";
import { UserButton } from "@clerk/nextjs";
import {  useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { userButtonAppearance } from "~/lib/buttonStyle";
import Image from "next/image";

type User = {
  name: string;
  userId : string;
};

interface Post {
    id: string;
    title: string;
    description: string;
    likes: number;
    ImageUrl: string;
  }

export default function Profile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState<User | undefined>(undefined);
    const [userPosts, setUserPosts] = useState<Post[]>([]);

    const fetchUserProfile = async (userId: string) => {
      const response = await fetch(`/api/user?userId=${userId}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const data = (await response.json()) as User;
      setProfile(data);
    };


  const fetchUserPosts = async (userId: string) => {
    const response = await fetch(`/api/userPosts?userId=${userId}`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to fetch user posts");

    const data = (await response.json()) as Post[];
    setUserPosts(data);
  };

    useEffect(() => {
      if (userId) {
        void fetchUserProfile(userId as string);
        void fetchUserPosts(userId as string);
      }
    }, [userId]);




  return (
    <section className="mt-12 flex h-screen w-full items-center flex-col  justify-center">
      <div className="mt-12 h-[400px] flex flex-col w-1/3 border-2 ">
        <h1 className="text-center text-2xl font-bold text-zinc-200">
          Profile
        </h1>
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-[100px] h-[100px] rounded-full bg-slate-200 overflow-hidden">
              <div className="absolute inset-0 w-[100px] h-[100px] flex items-center justify-center">
                <UserButton appearance={userButtonAppearance} />
              </div>
            </div>
            {profile && (
              <>
                <h2 className="text-xl text-zinc-200 text-cen font-semibold">{profile.name}</h2>
              </>
            )}
          </div>
        </div>
      </div>
          <div className="flex justify-center h-full w-full mt-8">
          {userPosts.length > 0 && (
              <ul>
                {userPosts.map((post) => (
                      <li
                      className="flex flex-col w-[400px] rounded-md border-2 p-4 text-zinc-200 mb-4"
                      key={post.id}
                    >
                      {post.ImageUrl && (
                        <Image
                          src={post.ImageUrl}
                          alt={post.title}
                          width={500}
                          height={150}
                          className="h-[200px] w-full object-cover rounded-sm"
                        />
                      )}
                      <div className="my-4 flex gap-4">
                        <p>Likes: {post.likes}</p>
                      </div>
                      <h2 className="text-xl font-semibold">{post.title}</h2>
                      <p>{post.description}</p>
                    </li>
                ))}
            </ul>
          )}
          </div>
    </section>
  );
}
