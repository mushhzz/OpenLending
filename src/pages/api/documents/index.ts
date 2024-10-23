import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { applicationId, documents } = req.body;
      
      const createdDocuments = await Promise.all(
        documents.map((doc: any) =>
          prisma.document.create({
            data: {
              applicationId,
              type: doc.type,
              blobUrl: doc.blobUrl
            }
          })
        )
      );

      return res.status(201).json(createdDocuments);
    } catch (error) {
      console.error('Failed to save documents:', error);
      return res.status(500).json({ error: 'Failed to save documents' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}