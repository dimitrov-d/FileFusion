import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '@/lib/iron';

const handler = async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            if (req.session.siwe) {
                res.status(200).json({ ok: true, session: req.session.siwe });
            } else {
                res.status(200).json({ ok: false, message: 'No active session found.' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default withIronSessionApiRoute(handler, ironOptions);
