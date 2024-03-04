import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prismaClient';
import { getServerSession } from 'next-auth';
import { NextApiRequest } from 'next';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { searchParams } = new URL(request.url as string)
      const userId = searchParams.get('userId')

    if(!userId) {
      return new NextResponse(JSON.stringify({ error: 'Some parameters are missing.' }), {
        status: 400,
      });
    }

    const taskExisting = await prisma.task.findMany({
        where: {
          userId
        },
      });    
      if (!taskExisting) {
      return new NextResponse(JSON.stringify({ error: 'This user doesn\'t have any task' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(JSON.stringify(taskExisting), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (e) {
    console.log({ e });
    return new NextResponse(JSON.stringify({ error: 'An error has been detected, please contact support.' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
