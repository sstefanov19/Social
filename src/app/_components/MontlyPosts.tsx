
"use client";
import React from "react";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import Image from "next/image";
import LikeButton from "./LikeButton";

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

const queryClient = new QueryClient();

export default function MontlyPosts() {



    const likePost = async (postId: string) => {
        const response = await fetch('/api/like', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId }),
        });

        if (!response.ok) {
          throw new Error('Failed to like post');
        }

        return response.json() as Promise<{ success: boolean }>;
      };

      const mutation = useMutation(likePost, {
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
        },
      });

      const handleLike = (postId: string) => {
        mutation.mutate(postId);
      };


  const fetchPosts = async (): Promise<Post[]> => {
    const response = await fetch("http://localhost:3000/api/posts", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Posts not found");
    }

    return response.json() as Promise<Post[]>;
  };

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="mt-8 flex flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-semibold text-slate-200">
        Explore our top Monthly posts
      </h1>
      <div className="h-[800px] w-2/4 overflow-y-auto rounded-md bg-[#393E46]">
        {Array.isArray(posts) && posts.length > 0 ? (
          <ul className="flex flex-col items-center justify-center p-4 text-white">
            {posts.map((post) => (
              <li
                className="mb-6 flex h-[350px] w-[500px] flex-col rounded-md border-2"
                key={post.id}
              >
                {post.user && <p>Author: {post.user.name}</p>}
                {post.ImageUrl && (
                  <Image
                    src={post.ImageUrl}
                    alt={post.title}
                    width={500}
                    height={150}
                    className="h-[150px] w-full"
                  />
                )}

                <div className="my-4 flex gap-4">
                 <LikeButton handleLike={() => handleLike} postId={post.id} />
                  <button>Comment</button>
                </div>
                  <p>Likes: {post.likes}</p>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <h1 className="text-bold text-2xl text-center text-white">No posts available</h1>
          </div>
        )}
      </div>
    </section>
  );
}
