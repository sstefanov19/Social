"use client";
import { UserButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { userButtonAppearance } from "~/lib/buttonStyle";
import Image from "next/image";

type User = {
  name: string;
  userId: string;
};

interface Post {
  id: string;
  title: string;
  description: string;
  likes: number;
  ImageUrl: string;
}

function imageLoader(config : {src : string , quality? : number}) {
    console.log(config);
    const urlStart = config.src.split("upload/")[0];
    const urlEnd = config.src.split("upload/")[1];
    const transformation = `w_500,q_${config.quality}`;
    return `${urlStart}upload/${transformation}/${urlEnd}`;
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
    <section className="mt-24 flex min-h-screen w-full flex-col items-center justify-center">
      <div className="mt-12 flex h-[500px] w-2/4 flex-col border-2">
        <h1 className="text-center text-2xl font-bold text-zinc-200">
          Profile
        </h1>
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full bg-slate-200">
              <div className="absolute inset-0 flex h-[100px] w-[100px] items-center justify-center">
                <UserButton appearance={userButtonAppearance} />
              </div>
            </div>
            {profile && (
              <>
                <h2 className="text-xl font-semibold text-zinc-200">
                  {profile.name}
                </h2>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex h-full w-full justify-center">
        {userPosts.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {userPosts.map((post) => (
              <li
                className="mb-4 flex w-[350px] flex-col rounded-md bg-[#2C3944] shadow-md p-4 text-zinc-200 md:w-[400px]"
                key={post.id}
              >
                {post.ImageUrl && (
                  <div className="relative">
                    <Image
                      loader={imageLoader}
                      quality={50}
                      src={post.ImageUrl}
                      alt={post.title}
                      width={500}
                      height={150}
                      className="fill h-[200px] rounded-sm"
                    />
                  </div>
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
