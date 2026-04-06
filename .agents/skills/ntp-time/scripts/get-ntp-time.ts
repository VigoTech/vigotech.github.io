#!/usr/bin/env node

import dgram from "node:dgram";

const NTP_DELTA = 2208988800;

function parseArgs(args: string[]) {
  let server = "pool.ntp.org";
  let timeout = 2000;

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];

    if (value === "--timeout") {
      const next = args[index + 1];
      if (!next) {
        throw new Error("missing value for --timeout");
      }
      timeout = Math.round(Number.parseFloat(next) * 1000);
      index += 1;
      continue;
    }

    if (!value.startsWith("-")) {
      server = value;
      continue;
    }

    throw new Error(`unknown argument: ${value}`);
  }

  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error("timeout must be a positive number");
  }

  return { server, timeout };
}

function queryNtp(server: string, timeout: number) {
  return new Promise<{ utcIso: string; unixEpoch: number }>((resolve, reject) => {
    const socket = dgram.createSocket("udp4");
    const packet = Buffer.alloc(48);
    packet[0] = 0x1b;

    const timer = setTimeout(() => {
      socket.close();
      reject(new Error("request timed out"));
    }, timeout);

    socket.on("error", (error) => {
      clearTimeout(timer);
      socket.close();
      reject(error);
    });

    socket.on("message", (message) => {
      clearTimeout(timer);
      socket.close();

      if (message.length < 48) {
        reject(new Error("short NTP response"));
        return;
      }

      const seconds = message.readUInt32BE(40);
      const fraction = message.readUInt32BE(44);
      const unixEpoch = seconds - NTP_DELTA + fraction / 2 ** 32;
      const utcIso = new Date(unixEpoch * 1000).toISOString();

      resolve({ utcIso, unixEpoch });
    });

    socket.send(packet, 123, server, (error) => {
      if (!error) {
        return;
      }

      clearTimeout(timer);
      socket.close();
      reject(error);
    });
  });
}

async function main() {
  const { server, timeout } = parseArgs(process.argv.slice(2));
  const { utcIso, unixEpoch } = await queryNtp(server, timeout);

  console.log(`server: ${server}`);
  console.log(`utc_iso: ${utcIso}`);
  console.log(`unix_epoch: ${unixEpoch.toFixed(6)}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`error: ${message}`);
  process.exitCode = 1;
});
