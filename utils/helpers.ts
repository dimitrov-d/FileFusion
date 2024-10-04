
const getFileBuffer = async (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            const arrayBuffer = reader.result;
            // @ts-ignore
            const buffer: Buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
            resolve(buffer);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};

const sendEmail = async (emailData: any) => {
    const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
        throw new Error('Email sending failed.');
    }
};

const helpers = {
    getFileBuffer,
    sendEmail
}

export default helpers;