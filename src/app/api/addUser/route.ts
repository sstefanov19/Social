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
          where: { email },
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
