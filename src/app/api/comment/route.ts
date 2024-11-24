import { NextRequest , NextResponse } from "next/server";
import { db } from "~/server/db";


export async function POST(req : NextRequest , res : NextResponse) {

    try {
        const formData = await req.formData();
        console.log("FormData", formData);

        const name = formData.get('name') as string
        const text = formData.get('text') as string;
        const postId = formData.get('postId') as string;
        const userId = formData.get('user') as string;

        const newComment = await db.comment.create({
            data: {
                name,
                text,
                postId : parseInt(postId),
                userId
            }
        })


        return NextResponse.json(newComment , {status : 201});


    } catch (error) {

        return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
    }

}



export async function GET(req: NextRequest, res: NextResponse) {
    try {
      const { searchParams } = new URL(req.url);
      const postId = searchParams.get('postId');

      if (!postId) {
        return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
      }

      const comments = await db.comment.findMany({
        where: {
          postId: parseInt(postId),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(comments, { status: 200 });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json({ message: 'Failed to get comments' }, { status: 500 });
    }
  }
