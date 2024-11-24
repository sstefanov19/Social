import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export  async function GET(req : NextRequest) {

    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') ?? '';


        if(!query || typeof query !== 'string') {
            return NextResponse.json({message : 'Invalid query'}, {status : 400})
        }

        const posts = await db.post.findMany({
            where : {
                title : {
                    contains: query,
                    mode: 'insensitive'
                }

            },
            orderBy: {
                likes : 'desc'
            }
        })

        if(!posts) {
            return NextResponse.json({message : 'No posts found'}, {status : 404})
        }

        return NextResponse.json(posts, {status : 200})


    } catch (error) {
        return NextResponse.json({message : 'Internal server error'}, {status : 500})
    }


}
