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
      const index = searchParams.get('index')
      const searchParamsObject: { [key: string]: string } = {};      
      searchParams.forEach((value, key) => {
        if(key === 'index') return
        searchParamsObject[key] = value;
    });

    if(!index) {
      return new NextResponse(JSON.stringify({ error: 'Some parameters are missing.' }), {
        status: 400,
      });
    }

    const tasks = await prisma.task.findMany();
    if (!tasks) {
        return new NextResponse(JSON.stringify({ error: 'This user doesn\'t have any task' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    const taskIdToSetAsTodo = tasks[parseInt(index)].id;

    const taskDeleted = await prisma.task.update({
      where: {
        id: taskIdToSetAsTodo,
      },
      data: searchParamsObject
    });


    return new NextResponse(JSON.stringify({ success: 'Task set as todo with success.', taskDeleted: taskDeleted }), {
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
