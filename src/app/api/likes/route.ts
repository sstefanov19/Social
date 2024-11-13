import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

type Post = {
  postId: number;
};

export async function PUT(req: NextRequest) {
  const { userId }: { userId: string | null } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json() as Post;

  if (!postId) {
    return NextResponse.json({ message: "Couldn't find post" }, { status: 400 });
  }

  try {
    // Check if the user has already liked the post
    const existingLike = await db.likes.findUnique({
      where: {
        postId_userId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // If the user has already liked the post, remove the like and decrement the like count
      await db.likes.delete({
        where: {
          id: existingLike.id,
        },
      });

      await db.posts.update({
        where: { id: postId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ message: "Post unliked successfully" }, { status: 200 });
    } else {
      await db.likes.create({
        data: {
          userId,
          postId,
        },
      });

      await db.posts.update({
        where: { id: postId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ message: "Post liked successfully" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error occurred while liking/unliking post", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
