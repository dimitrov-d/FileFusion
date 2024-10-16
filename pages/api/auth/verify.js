import { withIronSessionApiRoute } from 'iron-session/next';
import { parseSiweMessage } from 'viem/siwe';
import {Identity} from "@apillon/sdk";
import { ironOptions } from '@/lib/iron';

const handler = async (req, res) => {
    const { method } = req;
    switch (method) {
        case 'POST':
            try {
                const { message, signature } = req.body;
                const siweMessage = parseSiweMessage(message);

                const identity = new Identity();

                const validatedSignature = identity.validateEvmWalletSignature({
                    walletAddress: siweMessage.address,
                    message,
                    signature,
                })

                if (!validatedSignature.isValid) throw new Error('Invalid signature.');

                if (siweMessage.nonce !== req.session.nonce)
                    return res.status(422).json({ message: 'Invalid nonce.' });
           
                req.session.siwe = siweMessage;
                await req.session.save();
                res.json({ ok: true });
            } catch (_error) {
                res.json({ ok: false });
            }
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default withIronSessionApiRoute(handler, ironOptions);