import { LogLevel, Storage } from "@apillon/sdk";

if (!process.env.APILLON_API_KEY || !process.env.APILLON_API_SECRET) {
    throw new Error('Apillon SDK credentials are not properly set');
}

if(!process.env.APILLON_BUCKET_UUID) {
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
        const { directoryPath } = req.body;

        if(!directoryPath) {
            return res.status(400).json({ error: 'Missing parameter directoryPath' });
        }

        const allBucketFilesAndDirectories = await bucket.listObjects();
        const directoryUuid = allBucketFilesAndDirectories.items.find((item) => item.type === 1 && item.name === directoryPath)?.uuid;

        if(!directoryUuid) {
            return res.status(404).json({ error: 'Directory not found' });
        }

        const data = await bucket.listObjects({ directoryUuid });

        res.status(200).json({ data });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
