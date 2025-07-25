"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { apiFetch } from "@/lib/utils";
import ProtectedRoute from "@/lib/ProtectedRoute";

interface RecommendationDetail {
  id: string;
  crop_name: string;
  crop_category: string;
  suitability_level: string;
  suitability_score: number;
  best_planting_date?: string;
  planting_method?: string;
  spacing_recommendation?: string;
  planting_window_start?: string;
  planting_window_end?: string;
  expected_harvest_date?: string;
  harvesting_indicators?: string;
  expected_yield_per_hectare?: string | number;
  watering_schedule?: string;
  fertilizer_schedule?: string[] | string;
  pest_control_measures?: string[] | string;
  market_demand_level?: string;
  estimated_cost_per_hectare?: number;
  estimated_revenue_per_hectare?: number;
  seed_variety_suggestions?: string[] | string;
}

interface SoilPhoto {
  photo_url?: string;
  photo_filename?: string;
}

interface EnrichedRecommendationWithPhoto {
  recommendation: RecommendationDetail;
  prediction: Record<string, unknown> | null;
  soil_analysis: Record<string, unknown> | null;
  soil_photo?: SoilPhoto | null;
  weather_summary?: WeatherSummary;
  soil_analysis_summary?: string;
}

interface WeatherSummary {
  temperature?: number;
  feels_like?: number;
  humidity?: number;
  pressure?: number;
  wind_speed?: number;
  wind_direction?: number;
  uv_index?: number;
  visibility?: number;
  clouds?: number;
  weather?: string;
}

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<EnrichedRecommendationWithPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandWeather, setExpandWeather] = useState(false);
  const [expandSoil, setExpandSoil] = useState(false);
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/user/crop-recommendations/${id}`)
      .then((rec) => {
        if (!rec || rec.error) {
          router.push("/history");
        } else {
          setData(rec);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/history");
      });
  }, [id, router]);

  if (loading || !data) return <Loading />;

  const { recommendation, prediction, soil_analysis, soil_photo, weather_summary, soil_analysis_summary } = data;
  const date = soil_analysis?.created_at || prediction?.created_at || null;
  const location = soil_analysis ? [soil_analysis.city, soil_analysis.province].filter(Boolean).join(", ") : "-";

  return (
    <div className="min-h-screen relative overflow-hidden bg-secondary-ecru">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url('/result-bg.png')" }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-brunswick-green mb-2">
            Crop Recommendation Detail
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-4 max-w-6xl mx-auto">
          {/* Left Panel - Photo */}
          <div className="flex-1">
            <div className="rounded-xl p-6 relative h-full flex items-center justify-center">
              {soil_photo && soil_photo.photo_url && !imageError ? (
                <img
                  src={
                    process.env.NEXT_PUBLIC_API_BASE_URL
                      ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "") + soil_photo.photo_url
                      : soil_photo.photo_url
                  }
                  alt={soil_photo.photo_filename || "Soil Photo"}
                  className="rounded-xl object-cover max-h-80 max-w-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-gray-500 text-center py-8">No image</div>
              )}
            </div>
          </div>

          {/* Right Panel - AI Analysis Results */}
          <div className="flex-1">
            <div className="bg-primary-brunswick-green rounded-xl p-6 shadow-2xl h-full">
              <h2 className="text-white text-2xl font-bold text-center mb-6">
                AI Analysis Results
              </h2>
              <div className="mb-4">
                <div className="text-lg font-bold text-white text-center mb-2">{recommendation.crop_name}</div>
                <div className="text-gray-200 text-center mb-1">{recommendation.crop_category}</div>
                <div className="text-xs text-white text-center mb-1">{location || "Unknown location"}</div>
                {typeof date === 'string' || typeof date === 'number' ? (
                  <div className="text-xs text-white text-center mb-2">{new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                ) : null}
                <div className="w-full h-1 bg-green-300 rounded my-2" />
                <div className="text-base mb-2 text-white"><span className="font-semibold">Suitability Score:</span> {recommendation.suitability_score ?? '-'}%</div>
                <div className="text-base mb-2 text-white"><span className="font-semibold">Suitability Level:</span> {recommendation.suitability_level}</div>
                {/* Crop Details Grid - Modern Card Style */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/80 rounded-lg p-4 shadow">
                    <h4 className="font-semibold text-primary-brunswick-green mb-2">Planting & Growth</h4>
                    <div className="text-sm space-y-1">
                      <div><span className="font-medium">Method:</span> {recommendation.planting_method || '-'}</div>
                      <div><span className="font-medium">Spacing:</span> {recommendation.spacing_recommendation || '-'}</div>
                      <div><span className="font-medium">Best Date:</span> {typeof recommendation.best_planting_date === 'string' || typeof recommendation.best_planting_date === 'number' ? new Date(recommendation.best_planting_date).toLocaleDateString() : '-'}</div>
                      <div><span className="font-medium">Window:</span> {typeof recommendation.planting_window_start === 'string' || typeof recommendation.planting_window_start === 'number' ? new Date(recommendation.planting_window_start).toLocaleDateString() : '-'} - {typeof recommendation.planting_window_end === 'string' || typeof recommendation.planting_window_end === 'number' ? new Date(recommendation.planting_window_end).toLocaleDateString() : '-'}</div>
                      <div><span className="font-medium">Harvest Date:</span> {typeof recommendation.expected_harvest_date === 'string' || typeof recommendation.expected_harvest_date === 'number' ? new Date(recommendation.expected_harvest_date).toLocaleDateString() : '-'}</div>
                      <div><span className="font-medium">Harvest Time:</span> {recommendation.harvesting_indicators || '-'}</div>
                      <div><span className="font-medium">Expected Yield:</span> {typeof recommendation.expected_yield_per_hectare === 'string' || typeof recommendation.expected_yield_per_hectare === 'number' ? recommendation.expected_yield_per_hectare : '-'}</div>
                    </div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 shadow">
                    <h4 className="font-semibold text-primary-brunswick-green mb-2">Care & Market</h4>
                    <div className="text-sm space-y-1">
                      <div><span className="font-medium">Watering:</span> {recommendation.watering_schedule || '-'}</div>
                      <div><span className="font-medium">Fertilizer:</span> {Array.isArray(recommendation.fertilizer_schedule) ? (recommendation.fertilizer_schedule as string[]).join(', ') : (recommendation.fertilizer_schedule || '-')}</div>
                      <div><span className="font-medium">Pest Control:</span></div>
                      <ul className="list-disc list-inside ml-2 text-xs">
                        {Array.isArray(recommendation.pest_control_measures)
                          ? (recommendation.pest_control_measures as unknown[])
                              .filter((measure): measure is string => typeof measure === 'string' && measure.trim() !== '')
                              .map((measure, index) => <li key={index}>{measure}</li>)
                          : typeof recommendation.pest_control_measures === 'string' && recommendation.pest_control_measures.trim() !== ''
                            ? <li>{recommendation.pest_control_measures}</li>
                            : <li>No pest control measures available.</li>
                        }
                      </ul>
                      <div><span className="font-medium">Market Demand:</span> {recommendation.market_demand_level || '-'}</div>
                      <div><span className="font-medium">Cost/Hectare:</span> Rp {recommendation.estimated_cost_per_hectare !== undefined ? Number(recommendation.estimated_cost_per_hectare).toLocaleString() : '-'}</div>
                      <div><span className="font-medium">Revenue/Hectare:</span> Rp {recommendation.estimated_revenue_per_hectare !== undefined ? Number(recommendation.estimated_revenue_per_hectare).toLocaleString() : '-'}</div>
                      <div><span className="font-medium">Seed Varieties:</span></div>
                      <ul className="list-disc list-inside ml-2 text-xs">
                        {Array.isArray(recommendation.seed_variety_suggestions)
                          ? (recommendation.seed_variety_suggestions as unknown[])
                              .filter((variety): variety is string => typeof variety === 'string' && variety.trim() !== '')
                              .map((variety, index) => <li key={index}>{variety}</li>)
                          : typeof recommendation.seed_variety_suggestions === 'string' && recommendation.seed_variety_suggestions.trim() !== ''
                            ? <li>{recommendation.seed_variety_suggestions}</li>
                            : <li>No seed variety suggestions available.</li>
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Soil & Weather Details - Modern Card Style */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/80 rounded-lg p-4 shadow">
                    <h4 className="font-semibold text-primary-brunswick-green mb-2">Soil Details</h4>
                    <div className="text-sm space-y-1">
                      <div><span className="font-medium">Soil Type:</span> {typeof soil_analysis?.classified_soil_type === 'string' || typeof soil_analysis?.classified_soil_type === 'number' ? soil_analysis?.classified_soil_type : '-'}</div>
                      <div><span className="font-medium">Soil Color:</span> {typeof soil_analysis?.soil_color === 'string' || typeof soil_analysis?.soil_color === 'number' ? soil_analysis?.soil_color : '-'}</div>
                      <div><span className="font-medium">Soil Texture:</span> {typeof soil_analysis?.soil_texture === 'string' || typeof soil_analysis?.soil_texture === 'number' ? soil_analysis?.soil_texture : '-'}</div>
                      <div><span className="font-medium">Soil Drainage:</span> {typeof soil_analysis?.soil_drainage === 'string' || typeof soil_analysis?.soil_drainage === 'number' ? soil_analysis?.soil_drainage : '-'}</div>
                      <div><span className="font-medium">Soil Fertility:</span> {typeof soil_analysis?.soil_fertility === 'string' || typeof soil_analysis?.soil_fertility === 'number' ? soil_analysis?.soil_fertility : '-'}</div>
                      <div><span className="font-medium">Soil Moisture:</span> {typeof soil_analysis?.soil_moisture === 'string' || typeof soil_analysis?.soil_moisture === 'number' ? soil_analysis?.soil_moisture : '-'}</div>
                    </div>
                  </div>
                  {weather_summary && (
                    <div className="bg-white/80 rounded-lg p-4 shadow">
                      <h4 className="font-semibold text-primary-brunswick-green mb-2">Weather Details</h4>
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">Temperature:</span> {weather_summary.temperature}°C (feels like {weather_summary.feels_like}°C)</div>
                        <div><span className="font-medium">Weather:</span> {weather_summary.weather}</div>
                        <div><span className="font-medium">Humidity:</span> {weather_summary.humidity}%</div>
                        <div><span className="font-medium">Pressure:</span> {weather_summary.pressure} hPa</div>
                        <div><span className="font-medium">Wind:</span> {weather_summary.wind_speed} m/s, {weather_summary.wind_direction}°</div>
                        <div><span className="font-medium">UV Index:</span> {weather_summary.uv_index}</div>
                        <div><span className="font-medium">Visibility:</span> {weather_summary.visibility} km</div>
                        <div><span className="font-medium">Cloud Cover:</span> {weather_summary.clouds}%</div>
                      </div>
                    </div>
                  )}
                </div>
                <button className="mt-6 px-6 py-2 bg-white text-primary-brunswick-green rounded hover:bg-green-100 font-bold w-full" onClick={() => router.push("/history")}>Back to History</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 