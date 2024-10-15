import {Computing} from "@apillon/sdk";
import { ironOptions } from '@/lib/iron';
import {withIronSessionApiRoute} from "iron-session/next/index";

if (!process.env.APILLON_API_KEY || !process.env.APILLON_API_SECRET) {
    throw new Error('Apillon SDK credentials are not properly set');
}

if (!process.env.APILLON_COMPUTING_CONTRACT_UUID) {
    throw new Error('Apillon SDK contract UUID is not properly set');
}

const computing = new Computing({
    key: process.env.APILLON_API_KEY,
    secret: process.env.APILLON_API_SECRET,
});

const contract = computing.contract(process.env.APILLON_COMPUTING_CONTRACT_UUID);

const handler = async (req, res) => {
    // Check if the user is authenticated
    if (!req.session.siwe) {
        return res.status(401).json({ error: 'Unauthorized: User is not authenticated.' });
    }
    if (req.method === 'POST') {
        const { fileName, nftId, content } = req.body;

        if (!fileName || !nftId || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const bufferContent = Buffer.from(content, 'base64');
            const response = await contract.encryptFile({
                        fileName,
                        content: bufferContent,
                        nftId
                    });

            const responseData = response[0];

            if (!responseData.fileName || !responseData.CID || !responseData.fileUuid) {
                return res.status(500).json({ error: 'Failed to upload files' });
            }

            res.status(200).json({response});

        } catch (error) {
            console.error("Error uploading files:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

export default withIronSessionApiRoute(handler, ironOptions);
