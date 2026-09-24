import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, email } = body;

    // Map destination to IATA codes
    const destinationCodes: Record<string, string> = {
      chennai: 'MAA',
      bangalore: 'BLR', 
      mumbai: 'BOM',
      kerala: 'COK'
    };

    const destCode = destinationCodes[destination] || 'MAA';

    // Try to fetch real data from whentofly.io (free API)
    try {
      const whentoflyUrl = `https://whentofly.io/search?origin=airport:YYZ&destination=city:${destCode}&departure_date=2025-11-28&return_date=2026-01-05&adults=2&children_ages=7,2`;
      const response = await fetch(whentoflyUrl);
      
      if (response.ok) {
        const data = await response.json();
        // Transform whentofly data to our format
        const flights = data.results?.map((flight: any) => ({
          airline: flight.airline || 'Multiple Airlines',
          adult: flight.price_per_adult || Math.floor(flight.price / 2),
          child7: Math.floor((flight.price_per_adult || 0) * 0.75),
          child2: Math.floor((flight.price_per_adult || 0) * 0.1),
          total: flight.price || 3000,
          departure: flight.departure_date || "2025-11-28",
          return: flight.return_date || "2026-01-05",
          stops: flight.stops || 1,
          layover: flight.layover || "6h",
          origin: "YYZ",
          destination: destCode
        })) || [];

        if (flights.length > 0) {
          return NextResponse.json({ flights, source: 'whentofly' });
        }
      }
    } catch (whentoflyError) {
      console.log('Whentofly API unavailable, using mock data');
    }

    // Fallback to mock data with realistic variations
    const basePrice = 3000 + Math.floor(Math.random() * 500);
    const mockFlights = [
      {
        airline: "Qatar Airways",
        adult: basePrice,
        child7: Math.floor(basePrice * 0.75),
        child2: Math.floor(basePrice * 0.1),
        total: basePrice * 2 + Math.floor(basePrice * 0.75) + Math.floor(basePrice * 0.1),
        departure: "2025-11-28",
        return: "2026-01-05",
        stops: 1,
        layover: "8h",
        origin: "YYZ",
        destination: destCode
      },
      {
        airline: "Emirates",
        adult: basePrice - 50,
        child7: Math.floor((basePrice - 50) * 0.75),
        child2: Math.floor((basePrice - 50) * 0.1),
        total: (basePrice - 50) * 2 + Math.floor((basePrice - 50) * 0.75) + Math.floor((basePrice - 50) * 0.1),
        departure: "2025-11-29",
        return: "2026-01-06",
        stops: 1,
        layover: "7h",
        origin: "YYZ",
        destination: destCode
      },
      {
        airline: "Etihad",
        adult: basePrice + 50,
        child7: Math.floor((basePrice + 50) * 0.75),
        child2: Math.floor((basePrice + 50) * 0.1),
        total: (basePrice + 50) * 2 + Math.floor((basePrice + 50) * 0.75) + Math.floor((basePrice + 50) * 0.1),
        departure: "2025-11-30",
        return: "2026-01-07",
        stops: 1,
        layover: "6h",
        origin: "YYZ",
        destination: destCode
      }
    ];

    return NextResponse.json({ flights: mockFlights, source: 'mock' });
  } catch (error) {
    console.error('Error searching flights:', error);
    return NextResponse.json({ error: 'Failed to search flights' }, { status: 500 });
  }
}