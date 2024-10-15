import {LogLevel, Storage} from "@apillon/sdk";
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '@/lib/iron';

if (!process.env.APILLON_API_KEY || !process.env.APILLON_API_SECRET) {
    throw new Error('Apillon SDK credentials are not properly set');
}

if (!process.env.APILLON_BUCKET_UUID) {
    throw new Error('Apillon SDK bucket UUID is not properly set');
}

const storage = new Storage({
    key: process.env.APILLON_API_KEY,
    secret: process.env.APILLON_API_SECRET,
    logLevel: LogLevel.VERBOSE,
});

const bucket = storage.bucket(process.env.APILLON_BUCKET_UUID);

const handler = async (req, res) => {
    // Check if the user is authenticated
    if (!req.session.siwe) {
        return res.status(401).json({ error: 'Unauthorized: User is not authenticated.' });
    }
    if (req.method === 'POST') {

        const {fileName, contentType, content} = req.body;

        const directoryPath = req.session.siwe.address;

        if (!fileName || !contentType || !content || !directoryPath) {
            return res.status(400).json({error: 'Missing required fields'});
        }

        try {
            const bufferContent = Buffer.from(content, 'base64');
            const response = await bucket.uploadFiles(
                [
                    {
                        fileName: fileName,
                        contentType: contentType,
                        content:bufferContent
                    },
                ],
                {wrapWithDirectory: true, directoryPath, awaitCid: true}
            );
            console.log("response", response);
            const responseData = response[0];

            if (!responseData.fileName || !responseData.CID || !responseData.fileUuid) {
                return res.status(500).json({error: 'Failed to upload files'});
            }

            const ipfsLink = await storage.generateIpfsLink(responseData.CID);

            if (!ipfsLink) {
                return res.status(500).json({error: 'Failed to generate IPFS link'});
            }

            res.status(200).json({ipfs_url: ipfsLink});

        } catch (error) {
            console.error("Error uploading files:", error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({error: 'Method Not Allowed'});
    }
}

export default withIronSessionApiRoute(handler, ironOptions);

