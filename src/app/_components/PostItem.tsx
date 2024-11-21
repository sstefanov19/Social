import React from "react";
import Image from "next/image";
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";


interface Post {
  id: string;
  ImageUrl?: string;
  title: string;
  description: string;
  likes: number;
  user : {
    id : string;
  }
}

interface PostItemProps {
  post: Post;
  handleLike: (id: string) => void;
  likedPosts: Set<string>;
  onPostClick: (post: Post) => void;
}

const PostItem = React.memo(function PostItem({
  post,
  handleLike,
  likedPosts,
  onPostClick,
}: PostItemProps) {






  return (
    <li
      className="mb-6 flex w-[300px] flex-col rounded-md bg-[#2C3944] shadow-md p-4 md:w-[500px]"
      key={post.id}
      onClick={() => onPostClick(post)}
    >
      {post.ImageUrl && (
        <div className="relative">
        <Image
          src={post.ImageUrl}
          alt={post.title}
          width={500}
          height={150}
          className="fill h-[250px] rounded-sm"
          />
          </div>
      )}
      <div className="my-4 flex gap-2">
      </div>
      <h2 className="text-xl">{post.title}</h2>
      <div className="flex gap-1">
        {/*Like button */}
            <button onClick={() => handleLike(post.id)}>
          {likedPosts.has(post.id) ? (
              <BiSolidUpvote size={20} color="red" />
            ) : (
                <BiUpvote size={24} />
            )}
        </button>
            <p className="text-[20px]">{post.likes}</p>
        </div>
    </li>
  );
});

export default PostItem;
