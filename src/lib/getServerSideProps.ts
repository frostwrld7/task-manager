import { handler } from '@/app/api/auth/[...nextauth]/route';
import { IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"

export async function getServerSideProps(context: { req: any | NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }); res: any | ServerResponse<IncomingMessage> | NextApiResponse; }) {
  const session = await getServerSession(context.req, context.res, handler)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}