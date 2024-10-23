import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const application = await prisma.loanApplication.findFirst({
        where: {
          id: id as string,
          user: {
            azureAdId: session.user.sub
          }
        },
        include: {
          documents: true
        }
      });

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      return res.status(200).json(application);
    } catch (error) {
      console.error('Failed to fetch application:', error);
      return res.status(500).json({ error: 'Failed to fetch application' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}