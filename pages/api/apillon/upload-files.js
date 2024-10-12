import {LogLevel, Storage} from "@apillon/sdk";

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

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {fileName, contentType, content, directoryPath} = req.body;

        if (!fileName || !contentType || !content || !directoryPath) {
            return res.status(400).json({error: 'Missing required fields'});
        }

        try {
            const response = await bucket.uploadFiles(
                [
                    {
                        fileName,
                        contentType,
                        content
                    },
                ],
                {wrapWithDirectory: true, directoryPath, awaitCid: true}
            );
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
