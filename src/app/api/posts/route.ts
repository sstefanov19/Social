import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Replace with your actual auth import
import { db } from '~/server/db'; // Replace with your actual db import
import { uploadImage } from '~/server/cloudinary'; // Replace with your actual uploadImage import

export const config = {
  api: {
    bodyParser: false,
  },
};

type PostsCreateInput = {
  title: string;
  description: string;
  imageUrl: string | null;
  likes: number;
  userId: string;
};

export async function POST(req: NextRequest) {
  const { userId }: { userId: string | null } = await auth();

  if (!userId) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }

  try {
    console.log("User", userId);

    const formData = await req.formData();
    console.log("FormData", formData);

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('imageUrl') as File | null;

    if (!title || !description) {
      return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
    }

    // Check if userId exists in the User table
    const existingUser = await db.user.findUnique({
      where: { userId: userId },
    });

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const post = await db.posts.create({
      data: {
        title,
        description,
        ImageUrl: imageUrl,
        likes: 0,
        userId: userId,
      } as PostsCreateInput,
    });

    console.log(post);

    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    console.log("Failed to create post", error as Error);
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await db.posts.findMany({
      orderBy: {
        likes: 'desc'
      },
      take: 5
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log("Failed to fetch posts", error as Error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}
