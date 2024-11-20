import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  console.log("User id: ", userId);

  try {
    const userPosts = await db.post.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });



    return NextResponse.json(userPosts);
  } catch (error) {
    console.log("Failed to fetch user posts", error as Error);
    return NextResponse.json({ message: 'Failed to fetch user posts' }, { status: 500 });
  }
}
