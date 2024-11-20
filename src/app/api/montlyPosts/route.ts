import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
    try {

        const posts = await db.post.findMany({
            orderBy: {
                likes: 'desc',
            },
            take: 5,
            include: {
                user: {
                    select: {
                        name: true,
                    }
                }
            }
        });


        const postsWithLikeStatus = posts.map(post => ({
            ...post,
            likedByUser: post.likes > 0,
        }))

        return NextResponse.json(postsWithLikeStatus, { status: 200 });

    } catch (error) {
        console.log("Failed to fetch posts", error as Error);
        return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
    }
}
