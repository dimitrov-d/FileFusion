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

| Component                             | Technology/Service                                                                                                                |
| ------------------------------------- |-----------------------------------------------------------------------------------------------------------------------------------|
| **Authentication**                    | [RainbowKit](https://www.rainbowkit.com/) with [SIWE](https://login.xyz/) and [Iron Session](https://github.com/vvo/iron-session) |
| **File Uploads**                    | [Apillon SDK Storage](https://wiki.apillon.io/build/5-apillon-sdk.html#usage-example-1)                                           |
| **File Encryption / Decryption**| [Apillon SDK Computing](https://wiki.apillon.io/build/5-apillon-sdk.html#usage-example-4)                                         |
| **Get Transferred / Uploaded Files**        | [Apillon SDK Storage](https://wiki.apillon.io/build/5-apillon-sdk.html#usage-example-1)                                           |                                                            |
| **Decrypt encrypted file site**| [Template forked from Apillon Phala Demo](https://github.com/Apillon/apillon-phala-demo)                                          |
| **Email Sending Functioality**| [Nodemailer](https://www.npmjs.com/package/nodemailer)                                                                            |


## <a name="features">🤖 How It Works</a>
- **Sign in with Wallet Connect (using Metamask, WalletConnect or Coinbase Wallet)**
![Untitled design](https://i.ibb.co/7rGw6NW/Screenshot-2024-10-12-at-17-41-28.png)


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

#### Wallet Connect Project ID

Note: Every dApp that relies on WalletConnect now needs to obtain a projectId (NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) from [WalletConnect Cloud](https://cloud.walletconnect.com/). This is absolutely free and only takes a few minutes.
Once you get the Project ID from WalletConnect Cloud, you can set it as an environment variable in your project.

#### Iron Session Password
Iron Session will encrypt the session with the given secret key (NEXT_IRON_PASSWORD)
You can generate a secret key using this code on your terminal
`openssl rand -hex 32` or go to https://generate-secret.now.sh/32


#### Environment Variables
- ```NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=```
- ```APILLON_COMPUTING_CONTRACT_UUID=```
- ```APILLON_BUCKET_UUID=```
- ```APILLON_API_KEY=```
- ```APILLON_API_SECRET=```
- ```EMAIL_USER=```
- ```EMAIL_PASS=```
- ```EMAIL_HOST=```
- ```NEXT_IRON_PASSWORD=```

### Clone the repository

```git clone https://github.com/Ghost-xDD/FileFusion.git```

### Navigate to the project directory

`cd FileFusion`

### Install dependencies

`npm install`

# Start the application

`npm run dev`

