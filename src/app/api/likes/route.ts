import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

type Post = {
    postId : number;
}

export async function PUT(req: NextRequest, res: NextResponse) {

    const {userId} : {userId : string | null} = await  auth();


    if(!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {postId} = req.body as unknown as Post ;

    if(!postId) {
        return NextResponse.json({message: "Couldnt find post"}, {status:400});
    }

    try {

        const existingLike = await db.likes.findUnique({
            where: {
                userId_postId: {
                    postId,
                    userId
                }
            }
        });

        if(existingLike) {
            await db.posts.update({
                where: {id: postId},
                data: {
                    likes: {
                        decrement: 1,
                    }
                }
            })
        }


        await db.likes.create({
            data: {
                userId,
                postId
            }
        })

        await db.posts.update({
            where: {id: postId},
            data: {
                likes: {
                    increment: 1,
                }
            }
        })


        return res.status(200).json({message: "Post liked succesfully"});


    } catch (error) {

    }


}
