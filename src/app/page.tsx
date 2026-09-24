"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("chennai");
  const [isTracking, setIsTracking] = useState(false);
  const [prices, setPrices] = useState<any[]>([]);
  const [previousPrices, setPreviousPrices] = useState<any[]>([]);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const destinations = [
    { value: "chennai", label: "Chennai (MAA)" },
    { value: "bangalore", label: "Bangalore (BLR)" },
    { value: "mumbai", label: "Mumbai (BOM)" },
    { value: "kerala", label: "Kerala (COK)" },
  ];

  const airlines = [
    "Etihad", "Emirates", "Oman Air", "Lufthansa", 
    "British Airways", "Qatar Airways", "Air Canada", "Skyscanner"
  ];

  const checkPriceDrops = async (newPrices: any[]) => {
    if (previousPrices.length === 0) {
      setPreviousPrices(newPrices);
      return;
    }

    for (const newFlight of newPrices) {
      const oldFlight = previousPrices.find(
        (f) => f.airline === newFlight.airline && 
               f.departure === newFlight.departure &&
               f.return === newFlight.return
      );

      if (oldFlight && newFlight.total < oldFlight.total) {
        const priceDrop = oldFlight.total - newFlight.total;
        
        // Send alert for significant price drops (more than $50)
        if (priceDrop > 50) {
          await fetch('/api/send-alert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              flight: newFlight,
              priceDrop,
            }),
          });

          alert(`🎉 Price Drop Alert! ${newFlight.airline} dropped by $${priceDrop}`);
        }
      }
    }

    setPreviousPrices(newPrices);
  };

  const refreshPrices = async () => {
    if (!email) {
      alert("Please enter your email for alerts");
      return;
    }

    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, email }),
      });

      const data = await response.json();
      
      if (data.flights) {
        await checkPriceDrops(data.flights);
        setPrices(data.flights);
        setLastChecked(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      alert('Failed to refresh prices. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
  };

  const startTracking = async () => {
    if (!email) {
      alert("Please enter your email for alerts");
      return;
    }

    setIsTracking(true);
    
    // Initial fetch
    await refreshPrices();

    // Set up auto-refresh every 15-20 minutes (using 15 minutes = 900000ms)
    intervalRef.current = setInterval(() => {
      refreshPrices();
    }, 15 * 60 * 1000); // 15 minutes
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            ✈️ Flight Price Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            YYZ → India • Auto-check every 15-20 minutes
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email for Alerts
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {destinations.map((dest) => (
                  <option key={dest.value} value={dest.value}>
                    {dest.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Trip Details (Auto-set)</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p><strong>Passengers:</strong> 2 Adults, 1 Child (7y), 1 Child (2y)</p>
                <p><strong>Departure:</strong> Last week Nov - First week Dec 2025</p>
                <p><strong>Return:</strong> First - Second week Jan 2026</p>
                <p><strong>Max Travel Time:</strong> 35 hours</p>
                <p><strong>Preferences:</strong> Direct, 1-stop (6h+ layover), 2-stop (4h+ each)</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Airlines Tracked</h3>
              <div className="flex flex-wrap gap-2">
                {airlines.map((airline) => (
                  <span
                    key={airline}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {airline}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={isTracking ? stopTracking : startTracking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isTracking ? "⏹️ Stop Tracking" : "🚀 Start Tracking"}
            </button>

            {isTracking && (
              <button
                onClick={refreshPrices}
                disabled={isRefreshing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isRefreshing ? "🔄 Refreshing..." : "🔄 Refresh Now"}
              </button>
            )}

            {lastChecked && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Last checked: {lastChecked}
              </p>
            )}
          </div>

          {prices.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Current Prices
              </h2>
              <div className="space-y-4">
                {prices.map((price, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-green-200 dark:border-gray-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        {price.airline}
                      </h3>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${price.total}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        <span className="font-medium">Adult:</span> ${price.adult}
                      </div>
                      <div>
                        <span className="font-medium">Child (7y):</span> ${price.child7}
                      </div>
                      <div>
                        <span className="font-medium">Child (2y):</span> ${price.child2}
                      </div>
                      <div>
                        <span className="font-medium">Stops:</span> {price.stops} ({price.layover} layover)
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      📅 {price.departure} → {price.return}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>💡 Prices update every 15-20 minutes • Free service</p>
        </div>
      </div>
    </div>
  );
}