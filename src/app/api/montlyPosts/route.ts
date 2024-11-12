import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
    try {

        const posts = await db.posts.findMany({
            orderBy: {
                likes: 'desc'
            },
            take: 5,
            include :{
                user: {
                    select: {
                        name : true
                    }
                }
            }
        });

        console.log("Posts", posts);

        return NextResponse.json(posts);

    } catch (error) {
        console.log("Failed to fetch posts", error as Error);
        return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
    }
}
