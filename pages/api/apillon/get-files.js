import { LogLevel, Storage } from "@apillon/sdk";
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

    if (req.method === 'GET') {

        const directoryPath = req.session.siwe.address;

        if (!directoryPath) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            console.log("key", process.env.APILLON_API_KEY);
            console.log("secret", process.env.APILLON_API_SECRET);
            const allBucketFilesAndDirectories = await bucket.listObjects();
            const directoryUuid = allBucketFilesAndDirectories.items.find(
                (item) => item.type === 1 && item.name === directoryPath
            )?.uuid;

            if (!directoryUuid) {
                return res.status(404).json({ error: 'Directory not found' });
            }

            const data = await bucket.listObjects({ directoryUuid });

            res.status(200).json({ data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

export default withIronSessionApiRoute(handler, ironOptions);
