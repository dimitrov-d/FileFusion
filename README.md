<div align="">
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
</div>

## FileFusion
**Filefusion** is a decentralized, Web3 file-sharing and storage platform built on Apillon's infrastructure within the Polkadot ecosystem. It leverages blockchain technology to offer enhanced security, privacy, and user control over their data, while providing features similar to WeTransfer and Dropbox.

## 📋 <a name="table">Table of Contents</a>

1. ⚙️ [Tech Stack](#tech-stack)
2. 🔋 [Features](#features)
3. 🕸️ [Snippets](#snippets)




## <a name="tech-stack">⚙️ Tech Stack</a>

| Component                             | Technology/Service                                                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Authentication**                    | [Apillon Auth API](https://wiki.apillon.io/web3-services/5-web3-authentication.html#authentication-workflow)                                                       |
| **File Uploads**                    | [Apillon Storage API](https://wiki.apillon.io/build/2-storage-api.html)                                                                    |
| **File Encryption / Decryption**| [Apillon Computing API](https://wiki.apillon.io/build/8-computing-api.html)                                                        |
| **Decryption NFT Collection**              | [Apillon NFT API](https://wiki.apillon.io/build/4-nfts-api.html#mint-collection-nfts)                                               |
| **Get Transferred / Uploaded Files**        | [Apillon Storage](https://wiki.apillon.io/build/2-storage-api.html#list-bucket-content)                                                                                  |                                                            |
| **Decrypt encrypted file site**| [Template forked from Apillon Phala Demo](https://github.com/Apillon/apillon-phala-demo)                                                                      |
| **Email Sending Functioality**| [Nodemailer](https://www.npmjs.com/package/nodemailer)                                                                      |


## <a name="features">🤖 How It Works</a>
- **Sign in with KILT DID (using Sporran Wallet)**
![Untitled design](https://github.com/Ghost-xDD/FileFusion/assets/42726051/f54bb99b-d331-48c3-abcc-fb11849bd691)


Filefusion has three modes.
- **Storage Mode** - The storage mode works like a basic version of dropbox. Users can upload files and get a shareable link to access their uploaded files
<img width="1440" alt="storage-mode" src="https://github.com/Ghost-xDD/FileFusion/assets/42726051/4f8abb5f-c8dd-4dd9-99bf-13d64fd1de2c">
<img width="1440" alt="Screenshot 2024-06-06 at 11 07 37 PM" src="https://github.com/Ghost-xDD/FileFusion/assets/42726051/d8952145-202f-4b0d-9a04-0f56c7b4d1d6">

- **Transfer Mode** - Transfer mode functions as a web3 version of Wetransfer. Files are uploaded and transfered to recipient's email
<img width="1439" alt="transfer-mode" src="https://github.com/Ghost-xDD/FileFusion/assets/42726051/51cfc2b3-f90a-4e9e-b79b-b9e09ad39106">

- **Private Mode** - Files transferred using private mode are encrypted before they are uploaded and transferred to the recipient. User's get access to a decryption site in their email and only the wallet address with the designated NFT Key can access the file.
<img width="1440" alt="Screenshot 2024-06-10 at 4 18 07 PM" src="https://github.com/Ghost-xDD/FileFusion/assets/42726051/5e4a575b-55f7-49fc-8582-5f4a61081a07">


- Access all of your files transferred and uploaded using FileFusion
<img width="1440" alt="Screenshot 2024-06-10 at 4 16 17 PM" src="https://github.com/Ghost-xDD/FileFusion/assets/42726051/cede5957-0cfa-446b-bc10-9cd084ce9028">

#### Environment Variables
- ```NEXT_PUBLIC_APILLON_CREDENTIALS=```
- ```NEXT_PUBLIC_BUCKET_UUID=```
- ```NEXT_PUBLIC_ENCRYPTED_BUCKET_UUID=```
- ```NEXT_PUBLIC_COMPUTING_CONTRACT_UUID=```
- ```NEXT_PUBLIC_COLLECTION_UUID=```
- ```APILLON_API_KEY=```
- ```APILLON_API_SECRET=```
- ```EMAIL_USER=```
- ```EMAIL_PASS=```

### Clone the repository

```git clone https://github.com/Ghost-xDD/FileFusion.git```

### Navigate to the project directory

`cd FileFusion`

### Install dependencies

`npm install`

# Start the application

`npm run dev`

