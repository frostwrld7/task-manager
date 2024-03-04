import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prismaClient';

export async function POST(request: Request) {
  try {
    const reqToJSON = request.clone()
    const { email, username, password, passwordRepeated } = await reqToJSON.json();

    if(!email || !username || !password || !passwordRepeated) {
      return new NextResponse(JSON.stringify({ error: 'Some parameters are missing.' }), {
        status: 400,
      });
    }

    if (password !== passwordRepeated) {
      return new NextResponse(JSON.stringify({ error: 'Passwords do not match.' }), {
        status: 400,
      });
    }

    if (!email.includes('@')) {
      return new NextResponse(JSON.stringify({ error: 'Invalid email format.' }), {
        status: 400
      })
    }

    const hashedPassword = await hash(password, 10);


    const user = await prisma.user.findFirst(
      {
        where: {
          OR: [
            {
              username: username
            },
            {
              email: email
            }
          ]
        }
      }
    )
    if (user) {
      return new NextResponse(JSON.stringify({ error: 'This user already exists.' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      }
    })

    return new NextResponse(JSON.stringify({ success: 'User created successfully.' }), {
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
