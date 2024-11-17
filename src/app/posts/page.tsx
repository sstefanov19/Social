"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  description: string;
  likes: number;
  ImageUrl: string;
}

export default function AllPost() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Failed to fetch posts');

    const data: Post[] = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  return (
    <div className="flex h-screen mt-20 w-full justify-center">
      <main className="flex items-center flex-col w-full px-4">
        <h1 className="text-center font-bold text-2xl text-zinc-200 mb-8">Browse all posts</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {posts.map((post) => (
            <li
              className="flex flex-col w-[400px] rounded-md border-2 p-4 text-zinc-200"
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
      </main>
    </div>
  );
}
