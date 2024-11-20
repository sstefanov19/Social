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

  const { postId } = (await req.json()) as Post;

  if (!postId || typeof postId !== "number") {
    return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
  }

  try {
    let likedByUser = false;
    let updatedLikes = 0;

    await db.$transaction(async (tx) => {
      const existingLike = await tx.like.findUnique({
        where: {
          postId_userId: {
            userId,
            postId,
          },
        },
      });

      if (existingLike) {
        // Unlike post
        await tx.like.delete({
          where: {
            postId_userId: {
              userId,
              postId,
            },
          },
        });

        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: {
            likes: {
              decrement: 1,
            },
          },
        });

        likedByUser = false;
        updatedLikes = updatedPost.likes;
      } else {
        // Like post
        await tx.like.create({
          data: {
            userId,
            postId,
          },
        });

        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: {
            likes: {
              increment: 1,
            },
          },
        });

        likedByUser = true;
        updatedLikes = updatedPost.likes;
      }
    });

    return NextResponse.json(
      {
        message: "Success",
        likedByUser,
        updatedLikes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred while liking/unliking post", {
      userId,
      postId,
      error,
    });
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}
