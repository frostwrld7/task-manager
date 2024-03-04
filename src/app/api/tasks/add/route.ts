import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prismaClient';
import { getServerSession } from 'next-auth';
import { NextApiRequest } from 'next';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    const { publicId, title, status, label, priority, day, time } = await request.json();

    if(!publicId || !title || !status || !priority || !day || !time) {
      return new NextResponse(JSON.stringify({ error: 'Some parameters are missing.' }), {
        status: 400,
      });
    }

    const taskExisting = await prisma.task.findFirst(
      {
        where: {
            title
        }
      }
    )
    if (taskExisting) {
      return new NextResponse(JSON.stringify({ error: 'This tasks already exists.' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    const newTask = {
        publicId,
        title,
        status,
        label,
        priority,
        day,
        time,
        userId: session.user.id,
      };

      await prisma.task.create({
        data: newTask
      });

    return new NextResponse(JSON.stringify({ success: 'Task created successfully.' }), {
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
