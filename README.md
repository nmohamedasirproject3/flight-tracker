# Flight Price Tracker 🛫

A mobile-friendly web application to track flight prices from Toronto (YYZ) to Indian destinations with automatic price checking every 15-20 minutes.

## Features

- ✅ **Mobile-friendly** responsive design
- ✅ **Automatic price checking** every 15-20 minutes
- ✅ **Price drop alerts** via email
- ✅ **Multiple destinations**: Chennai, Bangalore, Mumbai, Kerala
- ✅ **Multiple airlines**: Etihad, Emirates, Oman Air, Lufthansa, British Airways, Qatar Airways, Air Canada, Skyscanner
- ✅ **Detailed price breakdown** per passenger type
- ✅ **100% free** to build and deploy

## Trip Configuration (Pre-set)

- **Passengers**: 2 Adults, 1 Child (7 years), 1 Child (2 years)
- **Departure**: Last week of November - First week of December 2025
- **Return**: First - Second week of January 2026
- **Max Travel Time**: 35 hours
- **Flight Preferences**: Direct, 1-stop (6h+ layover), 2-stop (4h+ each)
- **Origin**: YYZ (Toronto)
- **Nationality**: Canadian (visa-free/transit-friendly)

## Tech Stack

- **Frontend**: Next.js 16 + React + TypeScript
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (free tier)
- **API**: whentofly.io (free, no API key required)
- **Email**: Nodemailer (configure your own email service)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:3000

## Deployment to Vercel (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project" → "Import Git Repository"
4. Select this repository
5. Click "Deploy"

That's it! Vercel will automatically:
- Build your Next.js app
- Deploy it to a free domain
- Set up the cron job for automatic price checking

## Email Configuration (Optional)

To enable actual email alerts, configure environment variables in Vercel:

1. Go to your Vercel project → Settings → Environment Variables
2. Add:
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your email password/app password
3. Uncomment the email sending code in `src/app/api/send-alert/route.ts`

For Gmail, you'll need to:
- Enable 2-factor authentication
- Generate an app password at Google Account settings
- Use the app password as `EMAIL_PASS`

## API Integration

The app currently uses:
- **whentofly.io** - Free flight search API (no API key required)
- **Fallback mock data** - When external APIs are unavailable

To integrate other free APIs:
- **Google Flights MCP**: Use the free Google Flights MCP servers
- **FetchLayer**: Free tier available
- Check the code comments in `src/app/api/search/route.ts`

## Cron Job

The app includes a Vercel cron job that runs every 15 minutes:
- Checks prices for all configured routes
- Compares with previous prices
- Sends alerts for significant drops (> $50)

## Mobile Usage

The app is fully responsive and works great on Android:
- Add to home screen for app-like experience
- Works in any mobile browser
- No app installation required

## Future Enhancements

- Add more airlines
- Implement real-time push notifications
- Add price history charts
- Support more flexible date ranges
- Add multi-city trip support

## License

MIT