import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET(req : NextRequest) {

    const fullName = req.nextUrl.searchParams.get('fullName');

    console.log(fullName);


    if (!fullName) {
        return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
      }

    try {
        const user = await db.user.findFirst({
            where: {
                name: fullName,

            }
        })


        if(!user) {
            console.log("User not found in the database");
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);

    }catch(e) {
        console.log("Failed to fetch user", e as Error);
        return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
    }
}
