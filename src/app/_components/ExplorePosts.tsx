import Link from 'next/link';
import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";


export default function ExplorePosts() {
  return (
    <div className='flex w-full h-[200px] flex-col items-center  mt-8 '>
        <h1 className='text-xl text-zinc-200'>Explore more posts</h1>
        <Link href="/posts">
        <FaArrowRightLong className='text-xl text-zinc-200' />
        </Link>

    </div>
  )
}
