import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';

interface User {
    userId: string;
    name: string;
    email: string;

}

export async function POST(req: NextRequest) {

    try {

        const body = await req.json() as User;



        const { userId, name, email  } = body;


        await db.user.upsert({
          where: { userId },
          update: {},
          create: {
            userId,
            name,
            email,

          }
        });

        return NextResponse.json({ message: 'User added to database' });
      } catch (error) {
        console.log("Failed to add user to database", error as Error);
        return NextResponse.json({ message: 'Failed to add user to database' }, { status: 500 });
      }
}


export async function GET(req : NextRequest) {

    const userId = req.nextUrl.searchParams.get('userId');


    try {
        if(!userId) {
            return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });

        }
       const user =  await db.user.findUnique({
              where: {
                userId: userId
              }
       })

       if(!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
       }

       return NextResponse.json(user);


    } catch (error) {
        console.log("Failed to fetch user", error as Error);
        return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
    }

}
