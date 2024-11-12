import React from 'react';

interface LikeButtonProps {
  postId: string;
  handleLike: (postId: string) => void;
}

export default function LikeButton({ postId, handleLike }: LikeButtonProps) {
  const handleClick = () => {
    handleLike(postId);
  };

  return (
    <button onClick={handleClick} className="w-[40px] rounded-md bg-red-600">
      Like
    </button>
  );
}
