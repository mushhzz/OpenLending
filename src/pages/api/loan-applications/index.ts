import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const applications = await prisma.loanApplication.findMany({
        where: {
          user: {
            azureAdId: session.user.sub
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.status(200).json(applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  if (req.method === 'POST') {
    try {
      const application = await prisma.loanApplication.create({
        data: {
          ...req.body,
          user: {
            connectOrCreate: {
              where: { azureAdId: session.user.sub },
              create: {
                azureAdId: session.user.sub,
                email: session.user.email,
                name: session.user.name
              }
            }
          }
        }
      });
      return res.status(201).json(application);
    } catch (error) {
      console.error('Failed to create application:', error);
      return res.status(500).json({ error: 'Failed to create application' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}