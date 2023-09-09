// src/peerjs-config.ts
import { PeerServer } from 'peer';

export default (server: any) => {
  const peerServer = PeerServer({ port: 9000, path: '/aic_streams' });
};
