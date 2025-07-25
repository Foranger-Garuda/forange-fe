"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";

interface CropRecommendation {
  id: string;
  crop_name: string;
  crop_category: string;
  suitability_level: string;
  suitability_score: number;
  best_planting_date?: string;
  // Add more fields as needed
}

interface CropRecommendationCardProps {
  recommendation: CropRecommendation;
  onClick: () => void;
}

const CropRecommendationCard: React.FC<CropRecommendationCardProps> = ({ recommendation, onClick }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-6 m-2 cursor-pointer border-2 border-green-600 hover:scale-105 transition-transform min-w-[250px] max-w-xs flex flex-col items-center"
    onClick={onClick}
  >
    <div className="text-lg font-bold text-center mb-2">{recommendation.crop_name}</div>
    <div className="text-gray-700 text-center mb-1">{recommendation.crop_category}</div>
    <div className="text-sm text-center mb-2">Suitability: {recommendation.suitability_level} ({recommendation.suitability_score}%)</div>
    {/* Add more summary info as needed */}
    <div className="w-full h-1 bg-green-600 rounded my-2" />
    <div className="text-xs text-gray-500">ID: {recommendation.id}</div>
  </div>
);

const HistoryPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-900 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Revisit your previous discoveries!</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {Array.isArray(recommendations) && recommendations.length === 0 ? (
          <div className="text-white text-center">No historical crop recommendations found.</div>
        ) : (
          Array.isArray(recommendations) &&
            recommendations.map((rec) => (
              <CropRecommendationCard
                key={rec.id}
                recommendation={rec}
                onClick={() => {
                  // TODO: Implement navigation to detail page
                  alert(`Go to detail for ID: ${rec.id}`);
                }}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage; 