"use client";
import React, { useEffect, useState } from "react";

interface CropRecommendation {
  best_planting_date: string;
  crop_category: string;
  crop_name: string;
  estimated_cost_per_hectare: number;
  estimated_revenue_per_hectare: number;
  expected_harvest_date: string;
  expected_yield_per_hectare: string;
  fertilizer_schedule: string;
  harvesting_indicators: string;
  market_demand_level: string;
  pest_control_measures: string[];
  planting_method: string;
  planting_window_start: string;
  planting_window_end: string;
  seed_variety_suggestions: string[];
  spacing_recommendation: string;
  suitability_level: string;
  suitability_score: number;
  watering_schedule: string;
}

interface CropResult {
  coordinates_used: {
    lat: number;
    lon: number;
    source: string;
  };
  crop_prediction_id: string;
  crop_recommendation_ids: string[];
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
    name: string;
    state: string;
  };
  recommendations: CropRecommendation[];
  soil_analysis_record: {
    classified_soil_type: string;
    created_at: string;
    id: string;
    user_id: string;
  };
  soil_analysis_summary: string;
  soil_photo?: {
    id: string;
    filename: string;
    url: string;
  };
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  weather_data_id: string;
  weather_summary: {
    clouds: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    temperature: number;
    uv_index: number;
    visibility: number;
    weather: string;
    weather_main: string;
    wind_direction: number;
    wind_speed: number;
  };
}

const cropImages: Record<string, string> = {
  "Kangkung (Water Spinach)": "/crop-kangkung.jpg",
  "Rice": "/crop-rice.jpg",
  // Add more crop images as needed
};

// Helper to format date as 'Month Day, Year'
function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function CropResultPage() {
  const [result, setResult] = useState<CropResult | null>(null);
  const [expandWeather, setExpandWeather] = useState(false);
  const [expandSoil, setExpandSoil] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("cropResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  console.log('Soil photo:', result.soil_photo);
  const crop = result.recommendations?.[0] || {};
  const cropImage = cropImages[crop.crop_name] || "/result-example.png";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-white py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <div className="text-2xl font-bold text-center mb-4 mt-2">Here is your crop recommendation!</div>
        <div className="text-xl font-bold mb-2 text-center">{crop.crop_name}</div>
        <div className="text-gray-700 text-center mb-4">
          {crop.crop_category && <span className="font-medium">{crop.crop_category}</span>}
        </div>
        
        {/* Soil Photo Display */}
        {result.soil_photo && result.soil_photo.url && (
          <div className="w-full mb-4">
            <h3 className="text-lg font-semibold text-center mb-2">Soil Sample</h3>
            <div className="flex justify-center">
              <img
                src={`http://localhost:5000${result.soil_photo.url}`}
                alt="Soil sample"
                className="rounded-xl object-cover max-w-xs max-h-48 border-2 border-gray-200 shadow-md"
              />
            </div>
          </div>
        )}
        
        {/* Crop Details Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mx-auto justify-items-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-semibold text-blue-800 mb-1">Planting Information</h4>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Method:</span> {crop.planting_method}</div>
              <div><span className="font-medium">Spacing:</span> {crop.spacing_recommendation}</div>
              <div><span className="font-medium">Best Date:</span> {formatDate(crop.best_planting_date)}</div>
              <div><span className="font-medium">Window:</span> {formatDate(crop.planting_window_start)} - {formatDate(crop.planting_window_end)}</div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-semibold text-green-800 mb-1">Growth & Harvest</h4>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Harvest Date:</span> {formatDate(crop.expected_harvest_date)}</div>
              <div><span className="font-medium">Harvest Time:</span> {crop.harvesting_indicators}</div>
              <div><span className="font-medium">Expected Yield:</span> {crop.expected_yield_per_hectare}</div>
              <div><span className="font-medium">Suitability:</span> {crop.suitability_level} ({crop.suitability_score}%)</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3">
            <h4 className="font-semibold text-yellow-800 mb-1">Care Schedule</h4>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Watering:</span> {crop.watering_schedule}</div>
              <div><span className="font-medium">Fertilizer:</span> {crop.fertilizer_schedule}</div>
              <div><span className="font-medium">Pest Control:</span></div>
              <ul className="list-disc list-inside ml-2 text-xs">
                {Array.isArray(crop.pest_control_measures)
                  ? crop.pest_control_measures.map((measure, index) => (
                      <li key={index}>{measure}</li>
                    ))
                  : <li>No pest control measures available.</li>
                }
              </ul>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="font-semibold text-purple-800 mb-1">Economic & Market</h4>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Market Demand:</span> {crop.market_demand_level}</div>
              <div><span className="font-medium">Cost/Hectare:</span> Rp {crop.estimated_cost_per_hectare.toLocaleString()}</div>
              <div><span className="font-medium">Revenue/Hectare:</span> Rp {crop.estimated_revenue_per_hectare.toLocaleString()}</div>
              <div><span className="font-medium">Seed Varieties:</span></div>
              <ul className="list-disc list-inside ml-2 text-xs">
                {crop.seed_variety_suggestions.map((variety, index) => (
                  <li key={index}>{variety}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full justify-center mt-4">
          <button
            className="flex-1 bg-gray-200 rounded-xl py-4 text-center font-medium text-gray-800 hover:bg-gray-300 transition uppercase font-bold"
            onClick={() => setExpandWeather((v) => !v)}
          >
            {expandWeather ? "HIDE WEATHER DETAIL" : "SHOW WEATHER DETAIL"}
          </button>
          <button
            className="flex-1 bg-gray-200 rounded-xl py-4 text-center font-medium text-gray-800 hover:bg-gray-300 transition uppercase font-bold"
            onClick={() => setExpandSoil((v) => !v)}
          >
            {expandSoil ? "HIDE SOIL DETAIL" : "SHOW SOIL DETAIL"}
          </button>
        </div>
        {(expandWeather || expandSoil) && (
          <div className="w-full mt-4 flex gap-4">
            {expandWeather && (
              <div className="flex-1 bg-gray-100 rounded-xl p-4">
                <h3 className="text-lg font-bold mb-2">Weather Details</h3>
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Temperature:</span> {result.weather_summary.temperature}°C (feels like {result.weather_summary.feels_like}°C)</div>
                  <div><span className="font-medium">Weather:</span> {result.weather_summary.weather}</div>
                  <div><span className="font-medium">Humidity:</span> {result.weather_summary.humidity}%</div>
                  <div><span className="font-medium">Pressure:</span> {result.weather_summary.pressure} hPa</div>
                  <div><span className="font-medium">Wind:</span> {result.weather_summary.wind_speed} m/s, {result.weather_summary.wind_direction}°</div>
                  <div><span className="font-medium">UV Index:</span> {result.weather_summary.uv_index}</div>
                  <div><span className="font-medium">Visibility:</span> {result.weather_summary.visibility} km</div>
                  <div><span className="font-medium">Cloud Cover:</span> {result.weather_summary.clouds}%</div>
                </div>
              </div>
            )}
            {expandSoil && (
              <div className="flex-1 bg-gray-100 rounded-xl p-4">
                <h3 className="text-lg font-bold mb-2">Soil Details</h3>
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Soil Type:</span> {result.soil_analysis_summary.match(/SOIL_TYPE:\s*(.+)/)?.[1] || 'N/A'}</div>
                  <div><span className="font-medium">Color:</span> {result.soil_analysis_summary.match(/SOIL_COLOR:\s*(.+)/)?.[1] || 'N/A'}</div>
                  <div><span className="font-medium">Texture:</span> {result.soil_analysis_summary.match(/SOIL_TEXTURE:\s*(.+)/)?.[1] || 'N/A'}</div>
                  <div><span className="font-medium">Drainage:</span> {result.soil_analysis_summary.match(/SOIL_DRAINAGE:\s*(.+)/)?.[1] || 'N/A'}</div>
                  <div><span className="font-medium">Location Type:</span> {result.soil_analysis_summary.match(/SOIL_LOCATION_TYPE:\s*(.+)/)?.[1] || 'N/A'}</div>
                  <div><span className="font-medium">Fertility:</span> {result.soil_analysis_summary.match(/SOIL_FERTILITY:\s*(.+)/)?.[1] || 'N/A'}</div>
                  <div><span className="font-medium">Moisture:</span> {result.soil_analysis_summary.match(/SOIL_MOISTURE:\s*(.+)/)?.[1] || 'N/A'}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 