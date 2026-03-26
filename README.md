# VigoTech Website (Astro)

This project is the Astro migration of the VigoTech website.

## Commands

| Command                 | Action                                   |
| ----------------------- | ---------------------------------------- |
| `pnpm install`          | Install dependencies                     |
| `pnpm dev`              | Start local dev server                   |
| `pnpm dev --mockEvents` | Start dev with synthetic upcoming events |
| `pnpm generate:data`    | Refresh `public/vigotech-generated.json` |
| `pnpm check`            | Run Astro checks                         |
| `pnpm build`            | Type-check and build static site         |

## Data source

By default, the site reads source files from `public/`:

- `public/vigotech.json`
- `public/vigotech-generated.json`
- `public/friends.json`

Run `pnpm generate:data` to rebuild `public/vigotech-generated.json` from
`public/vigotech.json` using the legacy VigoTech source fetchers.

## Environment variables

- `VIGOTECH_MOCK_EVENTS`
  - Used in development to generate synthetic upcoming events when real events are not available.
  - Automatically set by `pnpm dev --mockEvents`.

- `VIGOTECH_CONFIG_DATA_DIR`
  - Optional override for local source JSON directory.
  - Default: `public`.
  - Used for `vigotech.json` and `friends.json`.

- `PUBLIC_BASE_PATH`
  - Optional base path for subpath deployments.
  - Example: `PUBLIC_BASE_PATH=vigotech-astro` produces URLs under `/vigotech-astro/`.
  - Leave empty for root deployments.

- `PUBLIC_NOINDEX`
  - Optional search-engine opt-out for non-production deployments.
  - Set to `true` to emit `<meta name="robots" content="noindex, nofollow">` on every page.
  - Recommended for temporary test deployments.

- `VIGOTECH_GENERATED_DATA_DIR`
  - Optional override for generated JSON directory.
  - Default: `public`.
  - Used only for `vigotech-generated.json`.

- `EVENTBRITE_OAUTH_TOKEN`
  - Optional token used while generating upcoming events from Eventbrite.
  - Used by `pnpm generate:data` and the Pages workflow.

- `YOUTUBE_API_KEY`
  - Optional API key used while generating `videoList` entries from YouTube.
  - Used by `pnpm generate:data` and the Pages workflow.

- `GOOGLE_CALENDAR_API_KEY`
  - Used by `/api/calendar.json` to fetch events from VigoTech public Google Calendar.
  - If omitted, the Axenda block still renders and keeps the iCal download link, but no live events are shown.

## Group status

- Group active/inactive is now manual.
- Set `inactive: true` in source data for archived groups.

Copy `.env.example` to `.env` and customize values for local work.
