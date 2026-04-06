---
name: ntp-time
description: Query the current date and time from an NTP server with a bundled script. Use when a user asks for network time, wants to compare system time with NTP time, or needs a minimal example skill that includes a script and a reference file.
---

# NTP Time

Use `scripts/get-ntp-time.ts` instead of reimplementing the NTP request.

Default to `pool.ntp.org` unless the user names a different server.

Run:

```bash
tsx scripts/get-ntp-time.ts
tsx scripts/get-ntp-time.ts time.google.com
node --experimental-strip-types scripts/get-ntp-time.ts
```

Return the server used, the UTC ISO timestamp, and the Unix epoch.

Read `references/ntp.md` only if you need protocol details or need to explain the output.

If the request fails, report the network error clearly and do not guess the time.
