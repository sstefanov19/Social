"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { IoMdHeart } from 'react-icons/io';
import PostModal from '../../_components/PostsModal';
import { BiSolidUpvote } from 'react-icons/bi';
interface Post {
  id: string;
  ImageUrl?: string;
  title: string;
  description: string;
  likes: number;
}

const SearchedPage = () => {
  const { slug } = useParams();
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen , setIsOpen] = useState(false);
  const [selectedPost , setSelectedPost] = useState<Post | null>(null);

  if (!slug) {
    throw new Error('No slug provided');
  }

  const fetchSearchedPosts = async () => {
    try {
      const query = Array.isArray(slug) ? slug.join('') : slug;
      const response = await fetch(`/api/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json() as Post[];
      setSearchedPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   void fetchSearchedPosts();
  }, [slug]);

  const handleModal = (post: Post) => {
    setIsOpen(true);
    setSelectedPost(post);
  };

  const handleClose = () => {
      setIsOpen(false);
      setSelectedPost(null);
  }



  if(isOpen) {
    return (
        <div className='mt-16'>
        {selectedPost && <PostModal closeModal={handleClose} post={selectedPost}  />}
        </div>
    )
  }

  if (loading) {
    return <div className='flex justify-center text-white mt-32'>Loading...</div>;
  }

  return (
    <div className='flex flex-col items-center text-white mt-32'>
      <h1>Posts related to: {slug}</h1>
      {searchedPosts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        searchedPosts.map((post) => (
          <div key={post.id} className='bg-slate-700 rounded-md md:w-[400px] w-[300px] p-4 mt-4'>
            {post.ImageUrl && (
                <Image src={post.ImageUrl} alt={post.title} width={400} height={200} className='h-[200px] w-[300px] md:w-[400px]' onClick={() => handleModal(post)}  />
            )}
            <h2 className='text-xl'>{post.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <BiSolidUpvote size={20} color="red" />
              <p>{post.likes}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchedPage;
