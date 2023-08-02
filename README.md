<a name="readme-top"></a>

<div align="center">
  <h3 align="center">P2P chat app using Holepunch</h3>
</div>

![Architecture Diagram](architecture.svg)


## About the App

Luganodes SDE Hiring Task List

A Peer-to-Peer (P2P) chat application, built with Holepunch, Hyperbee, and HyperDHT. This app enables secure and private communications without relying on a central server or third-party service.

At its core, Holepunch is used for bypassing network complexities, creating direct, decentralized connections between users. HyperDHT, a DHT (Distributed Hash Table) implementation, manages peer and socket connections effectively, while Hyperbee handles our data storage needs with efficiency and integrity.

Our chat app ensures end-to-end security with robust encryption, protecting your conversations from prying eyes. The use of Hyperbee reduces the risk of data breaches, as it removes the need for central data storage.

## Key Features

- Peer-to-Peer Communication
- Managed Connections
- Secure Conversations

## Tech Stack

- NodeJS
- Holepunch
- Hypercore
- Hyperbee
- HyperDHT

## Getting Started

### Prerequisites
Install [Node.js and npm](https://nodejs.org/en/download/)

### Setup

Clone the repo
```sh
git clone https://github.com/guptaharsh13/luganodes-task
```

Change into the directory, and install the required dependencies
```shell
cd luganodes-task
cd backend
npm i
cd ../frontend
npm i
  ```

## Usage

### Local Run

Start the server instance
```sh
cd backend
npm start
OR
npm run dev (for development environment)
```

You may spin up multiple client instances
```sh
cd frontend
npm start
```

### Docker Run

Start the server instance
```sh
cd backend
docker build -t chat-backend .
docker run -it chat-backend
```

You may spin up multiple client instances
```sh
cd frontend
docker build -t chat-backend .
docker run -it chat-backend
```

## Folder Structure
```
.
├── LICENSE.txt
├── README.md
├── architecture.svg
├── backend
│   ├── Dockerfile
│   ├── app.js
│   ├── package-lock.json
│   └── package.json
└── frontend
    ├── Dockerfile
    ├── app.js
    ├── package-lock.json
    └── package.json
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Harsh Gupta - hg242322@gmail.com

GitHub Link: [https://github.com/guptaharsh13](https://github.com/guptaharsh13)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<p align="center">Made with ❤ by Harsh Gupta</p>
