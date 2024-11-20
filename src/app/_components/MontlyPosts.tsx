"use client";
import React, { useEffect, useState } from "react";
import { handleLike } from "~/lib/handleLike";

import PostItem from "./PostItem";




interface Post {
  id: string;
  title: string;
  description: string;
  likes: number;
  ImageUrl: string;
  likedByUser: boolean;
  user: {
    name: string;
  };
}

export default function MontlyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
        try {
          const response = await fetch("/api/posts");
          if (!response.ok) throw new Error("Failed to fetch posts");
          const data = (await response.json()) as Post[];
          setPosts(data);
          setLikedPosts(new Set(data.filter(post => post.likedByUser).map(post => post.id)));
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
    };

    void fetchPosts();
},[]);



  if (loading) return <div className="text-center h-[1000px] text-xl font-bold text-zinc-200">Loading...</div>;
  if (error) return <div className="text-center h-[1000px] text-xl font-bold text-zinc-200" >Error: {error}</div>;

  return (
    <section className="flex flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-semibold text-slate-200">
        Explore our top Monthly posts
      </h1>
      <div className="w-2/4 ">
        {posts.length > 0 ? (
          <ul className="flex flex-col items-center justify-center p-4 text-white">
            {posts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    handleLike={() => handleLike(post.id , setPosts, setLikedPosts)}
                    likedPosts={likedPosts}

                    />
            ))}
          </ul>
        ) : (
          <div className="text-center text-white">No posts available</div>
        )}
      </div>
    </section>
  );
}
