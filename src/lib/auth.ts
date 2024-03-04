import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { NextAuthOptions, User, getServerSession } from 'next-auth';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismaClient'


export const authConfig: NextAuthOptions = {
    session: {
    strategy: "jwt",
  },
    providers: [
        CredentialsProvider({
            id: 'login',
            name: 'Sign in',
            credentials: {
                username: {
                    label: 'Username/E-mail',
                    type: 'text',
                    placeholder: 'Username/E-mail',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Password',
                },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.username ||!credentials.password)
                return null as unknown as User;
                const dbUser = await prisma.user.findFirst(
                    {
                      where: {
                        OR: [
                          {
                            username: credentials.username
                          },
                          {
                            email: credentials.username
                          }
                        ]
                      }
                    }
                  )
                if (!dbUser) return null as unknown as User;
                const passwordMatch = bcrypt.compare(credentials.password, dbUser?.password as string);
                if (await passwordMatch) {
                const dbUserWithoutPassword: Object = {
                    username: dbUser.username,
                    email: dbUser.email,
                    id: dbUser.id
                }
                return dbUserWithoutPassword as User;
                }
                return null as unknown as User;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_API_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_API_CLIENT_SECRET as string,
            async profile(profile) {
                const dbUser = await prisma.user.findFirst(
                    {
                      where: {
                        OR: [
                          {
                            username: profile.name
                          },
                          {
                            email: profile.email
                          }
                        ]
                      }
                    }
                  )                
                  if (dbUser) {
                    return {
                        id: profile.sub,
                        name: profile.name,
                        firstname: profile.given_name,
                        lastname: profile.family_name,
                        email: profile.email,
                        image: profile.picture,
                    }
                }
                await prisma.user.create({
                    data: {
                      email: profile.email as string,
                      username: profile.name as string,
                    }
                  })
                return {
                    id: profile.sub,
                    name: profile.name,
                    firstname: profile.given_name,
                    lastname: profile.family_name,
                    email: profile.email,
                    image: profile.picture,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ user , token }) {
          if (user) {
            token.user = { ...user }
          }
          return token
         },
        async session({ session, token }) {
          if (token?.user) {
            session.user = token.user as any
          }
          return session
        },
      },
}

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, authConfig)
  }