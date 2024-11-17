import React from "react";
import Image from "next/image";
import {CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";


interface Post {
  id: string;
  ImageUrl?: string;
  title: string;
  description: string;
  likes: number;
}

interface PostItemProps {
  post: Post;
  handleLike: (id: string) => void;
  likedPosts: Set<string>;

}

const PostItem = React.memo(function PostItem({ post, handleLike, likedPosts }: PostItemProps) {


    return (

        <li
        className="mb-6 flex flex-col md:w-[500px] w-[300px] rounded-md border-2 p-4"
        key={post.id}
      >
        {post.ImageUrl && (
          <Image
            src={post.ImageUrl}
            alt={post.title}
            width={500}
            height={150}
            className="h-[150px] rounded-sm w-full"
          />
        )}
        <div className="my-4 flex gap-4">
          {/* Like button */}
          <button
            onClick={() => handleLike(post.id)}>
            {likedPosts.has(post.id) ? <IoMdHeart size={24} color="red" /> : <CiHeart size={24} />}
          </button>
        </div>
        <p>Likes: {post.likes}</p>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
      </li>
    );
  });

  export default PostItem;
