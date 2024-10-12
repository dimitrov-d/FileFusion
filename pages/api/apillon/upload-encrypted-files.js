import {Computing} from "@apillon/sdk";

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

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { fileName, nftId, content } = req.body;

        if (!fileName || !nftId || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const response = await contract.encryptFile({
                        fileName,
                        content,
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
