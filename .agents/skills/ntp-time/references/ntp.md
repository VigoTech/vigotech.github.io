# NTP Notes

- NTP uses UDP port `123`.
- A minimal client can send a 48-byte packet with the first byte set to `0x1b`.
- The server transmit timestamp is stored in the last 8 bytes of the response.
- NTP timestamps count seconds since `1900-01-01T00:00:00Z`.
- Unix timestamps count seconds since `1970-01-01T00:00:00Z`.
- Convert NTP seconds to Unix seconds by subtracting `2208988800`.

The bundled script prints:

- `server`: hostname queried
- `utc_iso`: UTC timestamp in ISO 8601 form
- `unix_epoch`: Unix time as a floating-point number

Typical usage:

```bash
tsx scripts/get-ntp-time.ts
node --experimental-strip-types scripts/get-ntp-time.ts pool.ntp.org --timeout 2.0
```
