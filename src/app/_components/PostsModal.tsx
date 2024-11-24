import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BiSolidUpvote } from 'react-icons/bi';
import CommentsForm from './CommentsForm'; // Adjust the import based on your actual file structure
import {Button} from '~/components/ui/button'; // Adjust the import based on your actual file structure

interface Post {
  id: string;
  title: string;
  description: string;
  ImageUrl?: string;
  likes: number;
}

interface Comment {
  id: number;
  name: string;
  text: string;
  createdAt: string;
}

interface PostsModalProps {
  post: Post;
  closeModal: () => void;
}

export default function PostsModal({ closeModal, post }: PostsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [openComments, setOpenComments] = useState(false);

  const fetchComments = async () => {
    const response = await fetch(`/api/comment?postId=${post.id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const data = await response.json() as Comment[];
    setComments(data);
  };

  useEffect(() => {
    void fetchComments();
  }, []);

  const handleComments = () => {
    setOpenComments(prevVal => !prevVal);
  };

  const handleCommentSubmit = async () => {
    await fetchComments();
  };

  return (
    <div className='flex h-screen justify-center overflow-y-auto w-screen z-auto'>
      <div className='md:w-[1000px] w-[350px] bg-slate-900 p-2'>
        <div className='flex justify-between'>
          <h1 className='text-white text-4xl'>{post.title}</h1>
          <button onClick={closeModal} className='text-white'>X</button>
        </div>
        <p className='text-white my-6'>{post.description}</p>
        <Image src={post.ImageUrl ?? '/default-image.png'} alt={post.title} width={300} height={300} className='h-[300px] fill w-[400px]' />
        <div className="flex gap-1 mt-6">
          <BiSolidUpvote size={25} color="red" />
          <p className="text-[20px] text-white">{post.likes}</p>
          <div className='mx-10 text-[20px]'>
            <Button className='text-white h-[20px]' onClick={handleComments}>Comment</Button>
            {openComments && <CommentsForm postId={post.id.toString()} onCommentSubmit={handleCommentSubmit} />}
          </div>
        </div>
        <div className='mt-4'>
          <div className='h-[300px] overflow-y-auto'>
            {!openComments &&
            comments.map((comment) => (
              <div key={comment.id} className='h-[100px] bg-slate-700 rounded-md w-[300px] p-2 mt-4'>
                <p className='text-white'>{comment.name}</p>
                <p className='text-white mb-2'>{new Date(comment.createdAt).toLocaleDateString()}</p>
                <p className='text-white'>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
