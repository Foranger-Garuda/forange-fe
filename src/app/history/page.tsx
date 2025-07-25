"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/lib/ProtectedRoute";

interface EnrichedRecommendation {
  recommendation: {
    id: string;
    crop_name: string;
    crop_category: string;
    suitability_level: string;
    suitability_score: number;
    best_planting_date?: string;
    // ...other fields
  };
  prediction: {
    id: string;
    weather_warnings?: string;
    seasonal_advice?: string;
    best_planting_date?: string;
    expected_harvest_date?: string;
    created_at?: string; // Added for date
    city?: string; // Added for location
    province?: string; // Added for location
    // ...other fields
  } | null;
  soil_analysis: {
    id: string;
    classified_soil_type?: string;
    soil_color?: string;
    soil_texture?: string;
    soil_drainage?: string;
    soil_location_type?: string;
    soil_fertility?: string;
    soil_moisture?: string;
    created_at?: string; // Added for date
    city?: string; // Added for location
    province?: string; // Added for location
    // ...other fields
  } | null;
}

interface CropRecommendationCardProps {
  enriched: EnrichedRecommendation;
  onClick: () => void;
}

const CropRecommendationCard: React.FC<CropRecommendationCardProps> = ({ enriched, onClick }) => {
  const { recommendation, prediction, soil_analysis } = enriched;
  // Prefer soil_analysis.created_at, fallback to prediction.created_at
  const date = soil_analysis?.created_at || prediction?.created_at || null;
  // Prefer city/province from soil_analysis
  const location = soil_analysis ? [soil_analysis.city, soil_analysis.province].filter(Boolean).join(", ") : "-";
  return (
    <div
      className="bg-white rounded-2xl shadow-md p-6 m-2 cursor-pointer border-2 border-green-600 hover:scale-105 transition-transform w-80 flex flex-col items-center"
      onClick={onClick}
    >
      <div className="text-lg font-bold text-center mb-2">{recommendation.crop_name}</div>
      <div className="text-gray-700 text-center mb-1">{recommendation.crop_category}</div>
      <div className="text-sm text-center mb-2 font-semibold">Suitability Score: {recommendation.suitability_score ?? '-'}%</div>
      {/* Location and Date */}
      {date && <div className="text-xs text-gray-600 mb-2">{new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>}
      <div className="w-full h-1 bg-green-600 rounded my-2" />
      {/* Soil Type */}
      {soil_analysis && (
        <div className="text-xs text-gray-700 mb-1">Soil Type: <span className="font-semibold">{soil_analysis.classified_soil_type || '-'}</span></div>
      )}
    </div>
  );
};

const HistoryPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<EnrichedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiFetch("/user/crop-recommendations")
      .then((data) => {
        console.log("API response:", data);
        setRecommendations(Array.isArray(data) ? data : data.recommendations || data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setRecommendations([]); // Always set to array
        alert("Failed to fetch recommendations: " + err.message);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute>
      <div className=" flex min-h-screen bg-green-900 py-10 px-4 items-center justify-center">
        <div className="min-h-screen items-center justify-center">
            <h1 className="text-3xl font-bold text-center text-white mb-8">Revisit your previous discoveries!</h1>
            <div className="flex flex-wrap justify-center gap-6">
                {Array.isArray(recommendations) && recommendations.length === 0 ? (
                <div className="text-white text-center">No historical crop recommendations found.</div>
                ) : (
                Array.isArray(recommendations) &&
                    recommendations
                      .filter(rec => rec && rec.recommendation && rec.recommendation.id)
                      .map((rec, idx) => (
                    <CropRecommendationCard
                        key={rec.recommendation.id + idx}
                        enriched={rec}
                        onClick={() => {
                          router.push(`/history/${rec.recommendation.id}`);
                        }}
                    />
                    ))
                )}
            </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default HistoryPage; 