// @ts-nocheck
import React from 'react';
import { Socket } from 'socket.io-client';

// TODO: Migrate these interfaces to the gk-types submodule in the future
export interface ServerToClientEvents {
  'message:show': ({ message: string }) => void;
  'task:update': (taskId: string) => void;
  'user:logout': () => void;
  'attendance:start': ({ userId: string }) => void;
  'attendance:stop': (payload: {
    userId: string;
    message: string | null;
  }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface SocketContextInterface {
  socket: Socket | null;
  addSocketEventHandler: <K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K],
  ) => void;
}

export const SocketContext = React.createContext<SocketContextInterface>({
  socket: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addSocketEventHandler: () => {},
});
