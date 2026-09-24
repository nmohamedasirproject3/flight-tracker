import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, flight, priceDrop } = body;

    // For demo purposes, we'll use console logging
    // In production, configure real email service (Gmail, SendGrid, etc.)
    console.log('📧 Email Alert would be sent to:', email);
    console.log('Flight:', flight.airline);
    console.log('Price Drop:', priceDrop);
    console.log('New Total:', flight.total);

    // Example email configuration (uncomment and configure for production)
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Price Drop Alert: ${flight.airline} - $${priceDrop} off!`,
      html: `
        <h2>Flight Price Drop Alert! 🎉</h2>
        <p>Great news! The price for your tracked flight has dropped by <strong>$${priceDrop}</strong></p>
        
        <h3>Flight Details:</h3>
        <ul>
          <li><strong>Airline:</strong> ${flight.airline}</li>
          <li><strong>Route:</strong> ${flight.origin} → ${flight.destination}</li>
          <li><strong>Departure:</strong> ${flight.departure}</li>
          <li><strong>Return:</strong> ${flight.return}</li>
          <li><strong>Stops:</strong> ${flight.stops} (${flight.layover} layover)</li>
        </ul>
        
        <h3>Price Breakdown:</h3>
        <ul>
          <li><strong>Adult:</strong> $${flight.adult} x 2 = $${flight.adult * 2}</li>
          <li><strong>Child (7y):</strong> $${flight.child7}</li>
          <li><strong>Child (2y):</strong> $${flight.child2}</li>
          <li><strong>Total:</strong> $${flight.total}</li>
        </ul>
        
        <p><a href="https://www.google.com/travel/flights">Book now on Google Flights</a></p>
        
        <p><em>This is an automated alert from your Flight Price Tracker.</em></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Alert logged (configure email service for production)' 
    });
  } catch (error) {
    console.error('Error sending alert:', error);
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 });
  }
}