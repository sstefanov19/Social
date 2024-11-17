"use client";
import React, { useEffect, useState } from "react";

import PostItem from "./PostItem";




interface Post {
  id: string;
  title: string;
  description: string;
  likes: number;
  ImageUrl: string;
  user: {
    name: string;
  };
}

export default function MontlyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts initially
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/montlyPosts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = (await response.json()) as Post[];
        setPosts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

     void fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch("/api/likes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Failed to like post");

      const result = (await response.json()) as { message: string };


      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: result.message.includes("liked") ? post.likes + 1 : post.likes - 1 }
            : post
        )
      );

    setLikedPosts((prevLikedPosts) => {
      const updatedLikedPosts = new Set(prevLikedPosts);
      if (result.message.includes("liked")) {
        updatedLikedPosts.add(postId);
      } else {
        updatedLikedPosts.delete(postId);
      }
      return updatedLikedPosts;
    });
    } catch (err) {
      console.error(err);
    }
  };

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
                    handleLike={handleLike}
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
