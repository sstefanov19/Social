"use client";
import React, { useEffect, useState } from 'react';
import { handleLike } from '~/lib/handleLike';
import Image from 'next/image';
import { IoMdHeart } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { useUser } from '@clerk/nextjs';
import PostModal from '../_components/PostsModal';
import { BiSolidUpvote, BiUpvote } from 'react-icons/bi';

type Post = {
    id: string;
    title: string;
    description: string;
    likes: number;
    ImageUrl: string;
    likedByUser: boolean;
    user: {
        id: string;
        name: string;
    }
}

export default function AllPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts , setLikedPosts] = useState<Set<string>>(new Set());
  const [error , setError] = useState<string | null>(null);
  const [loading , setLoading] = useState(false);
  const [isOpen , setIsOpen] = useState(false);
  const [selectedPost , setSelectedPost] = useState<Post | null>(null);

  const handleModal = (post: Post) => {
    setIsOpen(true);
    setSelectedPost(post);
  };

  const handleClose = () => {
      setIsOpen(false);
      setSelectedPost(null);
  }



  const {user} = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
        setLoading(true);
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


if(isOpen) {
    return (
        <div className='mt-16'>
        {selectedPost && <PostModal closeModal={handleClose} post={selectedPost}  />}
        </div>
    )
  }

  return (
    <div className="flex h-screen mt-20 w-full justify-center">
      <main className="flex items-center flex-col w-full px-4">
        <h1 className="text-center font-bold text-2xl text-zinc-200 mb-8">Browse all posts</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {posts.map((post) => (
            <li
              className="flex flex-col w-[400px] rounded-md shadow-md  bg-[#2C3944] p-4 text-zinc-200"
              key={post.id}
            >
              {post.ImageUrl && (
                <Image
                onClick={() => handleModal(post)}
                  src={post.ImageUrl}
                  alt={post.title}
                  width={500}
                  height={150}
                  className="h-[200px] w-full object-cover rounded-sm"
                />
              )}
              <div className="my-4 flex gap-4">
              <button onClick={() => user && handleLike(post.id , user.id , setPosts , setLikedPosts)}>
          {likedPosts.has(post.id) ? (
            <BiSolidUpvote size={24} color="red" />
          ) : (
            <BiUpvote size={24} />
          )}
        </button>

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
