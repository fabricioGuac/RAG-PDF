# RAG PDF

## Description 

RAG PDF is an AI powered PDF assistant that allows users to upload PDFs and interact with their contents through natural chats.

The app leverages:

* Firebase Authentication for user accounts

* Firestore for storing PDF metadata

* Firebase Storage for storing the uploaded PDFs

* Qdrant as a vector database for embeddings

* OpenAI API for embedding generation and querying

The frontend is a React + TypeScript + Vite application, and the backend is an Express + TypeScript server. The backend is deployed on Render, while the client is deployed on Vercel.

## Instalation

No installation needed; the app is deployed. For local development, clone the repo, create a .env with values for the variables inside server/config/env.ts, run: 

```
# Install dependencies for server and client
npm install

# Start both server and client locally
npm run dev

```

## Usage

1. Create an account or log in using Firebase Authentication.
2. Upload a PDF via the sidebar.
3. Open the PDF once it is added to the sidebar.
4. Read the PDF in the integrated PDF reader while chatting with the AI assistant side by side.
5. Ask questions about the PDF content in the chat interface.
6. The app returns answers based on the PDF content using embeddings and OpenAI.


## Screenshot displaying the deployed app

![chat with a pdf](./client/public/)

## URL to the deployed app

[Rag PDF deployed link](https://rag-pdf-psi.vercel.app/)

## License

MIT License

Copyright (c) 2024 fabricioGuac

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Questions

If you have any questions or need help with the project, feel free to contact me through the following channels: - Connect with me on GitHub at [fabricioGuac](https://github.com/fabricioGuac)  - Drop me an email at [guacutofabricio@gmail.com](https://github.com/guacutofabricio@gmail.com)   Don't hesitate to reach out if you need any clarifications or want to share feedback. I'm here to assist you!