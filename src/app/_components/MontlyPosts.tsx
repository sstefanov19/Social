"use client";
import React, { useEffect, useState } from "react";
import { handleLike } from "~/lib/handleLike";
import { useUser } from "@clerk/nextjs";
import PostItem from "./PostItem";
import PostModal from "./PostsModal";

interface Post {
  id: string;
  title: string;
  description: string;
  likes: number;
  ImageUrl: string;
  likedByUser: boolean;
  user: {
    id: string;
    name: string;
  };
}

export default function MontlyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/montlyPosts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = (await response.json()) as Post[];
        setPosts(data);
        setLikedPosts(
          new Set(
            data.filter((post) => post.likedByUser).map((post) => post.id),
          ),
        );
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, []);

  const handleModal = (post: Post) => {
    setIsOpen(true);
    setSelectedPost(post);
  };

  const handleClose = () => {
      setIsOpen(false);
      setSelectedPost(null);
  }


  if(isOpen) {
    return <PostModal closeModal={handleClose} post={selectedPost} />
  }

  if (loading)
    return (
      <div className="h-[1000px] text-center text-xl font-bold text-zinc-200">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="h-[1000px] text-center text-xl font-bold text-zinc-200">
        Error: {error}
      </div>
    );

  return (
    <section className="flex flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-semibold text-slate-200">
        Top posts of the month
      </h1>
      <div className="w-2/4">
        {posts.length > 0 ? (
          <ul className="flex flex-col items-center justify-center p-4 text-white">
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                handleLike={() =>
                  user && handleLike(post.id, user.id, setPosts, setLikedPosts)
                }
                likedPosts={likedPosts}
                onPostClick={() => handleModal(post)}
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
