"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/utils";
import nextDynamic from "next/dynamic";
import ProtectedRoute from "@/lib/ProtectedRoute";

// Dynamically import all map-related components and Leaflet to avoid SSR issues
const MapComponent = nextDynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
});

export default function ResultPage() {
  const [soilColor, setSoilColor] = useState("");
  const [soilTexture, setSoilTexture] = useState("");
  const [soilDrainage, setSoilDrainage] = useState("");
  const [soilLocationType, setSoilLocationType] = useState("");
  const [soilFertility, setSoilFertility] = useState("");
  const [soilMoisture, setSoilMoisture] = useState("");
  const [result, setResult] = useState<{ characteristics?: Record<string, string>; photo_url?: string } | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitResult, setSubmitResult] = useState<{ [key: string]: unknown } | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Set mounted flag after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run this effect after component is mounted
    if (!isMounted) return;

    try {
      const stored = sessionStorage.getItem("uploadResult");
      console.log("sessionStorage uploadResult (on result page):", stored);
      if (stored) {
        const { result, fileName, previewUrl } = JSON.parse(stored);
        setResult(result);
        setFileName(fileName);
        setPreviewUrl(previewUrl);
        console.log("Loaded result:", result);
        
        // Normalization helper
        const normalize = (s: string) => s?.toString().trim().toLowerCase();
        
        // Dropdown options
        const colorOptions = ["Brown", "Dark Brown", "Reddish", "Yellowish", "Black", "Gray"];
        const locationOptions = ["Valley", "Slope", "Plain", "Hill", "Riverbank", "Coastal", "Plateau"];
        const textureOptions = ["Sandy", "Silty", "Clayey", "Loamy", "Peaty", "Gravelly"];
        const fertilityOptions = ["High", "Medium", "Low", "Very Low"];
        const drainageOptions = ["Well-drained", "Poorly-drained", "Moderately-drained", "Excessively-drained", "Waterlogged"];
        const moistureOptions = ["Wet", "Moist", "Dry", "Very Dry", "Waterlogged"];
        
        if (result?.characteristics) {
          const c = result.characteristics;
          const findMatch = (val: string, opts: string[]) => opts.find(opt => normalize(opt) === normalize(val)) || opts[0];
          setSoilColor(findMatch(c.soil_color, colorOptions));
          setSoilTexture(findMatch(c.soil_texture, textureOptions));
          setSoilDrainage(findMatch(c.soil_drainage, drainageOptions));
          setSoilLocationType(findMatch(c.soil_location_type, locationOptions));
          setSoilFertility(findMatch(c.soil_fertility, fertilityOptions));
          setSoilMoisture(findMatch(c.soil_moisture, moistureOptions));
        }
      } else {
        router.push("/upload");
      }
    } catch (error) {
      console.error("Error loading from sessionStorage:", error);
      router.push("/upload");
    }
  }, [router, isMounted]);

  useEffect(() => {
    // Only run geolocation after component is mounted
    if (!isMounted) return;

    setLocationLoading(true);
    setLocationError("");
    
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLon(pos.coords.longitude);
          setLocationLoading(false);
        },
        (err) => {
          setLocationError("Could not retrieve location: " + err.message);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  }, [isMounted]);

  const Dropdown = ({
    label,
    value,
    setValue,
    options,
  }: {
    label: string;
    value: string;
    setValue: (value: string) => void;
    options: string[];
  }) => (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium block">{label}</label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full bg-white text-black font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitResult(null);
    
    try {
      const payload = {
        classified_soil_type: result?.characteristics?.classified_soil_type || "",
        soil_color: soilColor,
        soil_texture: soilTexture,
        soil_drainage: soilDrainage,
        soil_location_type: soilLocationType,
        soil_fertility: soilFertility,
        soil_moisture: soilMoisture,
        ...(lat !== null && lon !== null ? { lat, lon } : {}),
      };
      
      const data = await apiFetch("/soil/submit", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      
      setSubmitResult(data);
      
      if (isMounted && typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("cropResult", JSON.stringify(data));
      }
      
      router.push("/upload/crop-result");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Submission failed");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen relative overflow-hidden bg-secondary-ecru">
          <div className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
               style={{ backgroundImage: "url('/result-bg.png')" }}>
          </div>
          <div className="relative z-10 container mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-brunswick-green mb-2">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
              Photo Uploaded. Let&apos;s Dig In!
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-4 max-w-6xl mx-auto">
            {/* Left Panel - Photo */}
            <div className="flex-1">
              <div className="rounded-xl p-6 relative h-full flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={fileName}
                    className="rounded-xl object-cover max-h-80 max-w-full"
                  />
                ) : result && result.photo_url ? (
                  <img
                    src={
                      process.env.NEXT_PUBLIC_API_BASE_URL
                        ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "") + result.photo_url
                        : result.photo_url
                    }
                    alt={fileName}
                    className="rounded-xl object-cover max-h-80 max-w-full"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat rounded-xl"
                    style={{ backgroundImage: "url('/result-example.png')" }}
                  ></div>
                )}
              </div>
            </div>

            {/* Right Panel - AI Analysis Results */}
            <div className="flex-1">
              <div className="bg-primary-brunswick-green rounded-xl p-6 shadow-2xl h-full">
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                  AI Analysis Results
                </h2>

                {result ? (
                  <form onSubmit={handleSubmit}>
                    {locationLoading && (
                      <div className="text-yellow-600 text-center mb-2">Detecting your location...</div>
                    )}
                    {locationError && (
                      <div className="text-red-500 text-center mb-2">{locationError}</div>
                    )}
                    
                    <div className="mb-4">
                      <div className="text-xs text-white mb-2">Click on the map or drag the marker to set your location.</div>
                      <label className="block text-white font-medium mb-2">Pick Location on Map</label>
                      <div className="rounded-lg overflow-hidden border border-gray-300" style={{ height: 300 }}>
                        <MapComponent 
                          lat={lat} 
                          lon={lon} 
                          setLat={setLat} 
                          setLon={setLon} 
                        />
                      </div>
                      {lat && lon && (
                        <div className="text-xs text-white mt-2">Selected: {lat.toFixed(5)}, {lon.toFixed(5)}</div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <Dropdown
                        label="Soil Color"
                        value={soilColor || "Brown"}
                        setValue={setSoilColor}
                        options={["Brown", "Dark Brown", "Reddish", "Yellowish", "Black", "Gray"]}
                      />
                      <Dropdown
                        label="Soil Location Type"
                        value={soilLocationType || "Valley"}
                        setValue={setSoilLocationType}
                        options={["Valley", "Slope", "Plain", "Hill", "Riverbank", "Coastal", "Plateau"]}
                      />
                      <Dropdown
                        label="Soil Texture"
                        value={soilTexture || "Sandy"}
                        setValue={setSoilTexture}
                        options={["Sandy", "Silty", "Clayey", "Loamy", "Peaty", "Gravelly"]}
                      />
                      <Dropdown
                        label="Soil Fertility"
                        value={soilFertility || "High"}
                        setValue={setSoilFertility}
                        options={["High", "Medium", "Low", "Very Low"]}
                      />
                      <Dropdown
                        label="Soil Drainage"
                        value={soilDrainage || "Well-drained"}
                        setValue={setSoilDrainage}
                        options={["Well-drained", "Poorly-drained", "Moderately-drained", "Excessively-drained", "Waterlogged"]}
                      />
                      <Dropdown
                        label="Soil Moisture"
                        value={soilMoisture || "Wet"}
                        setValue={setSoilMoisture}
                        options={["Wet", "Moist", "Dry", "Very Dry", "Waterlogged"]}
                      />
                    </div>
                    
                    <Button
                      className="w-full p-4 bg-primary-sea-green hover:bg-white text-white hover:text-primary-sea-green font-bold rounded-md transition-colors duration-200"
                      size="lg"
                      disabled={!result || submitLoading}
                      type="submit"
                    >
                      {submitLoading ? "Submitting..." : "Refine Soil Details"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-white text-center py-8">Loading analysis result...</div>
                )}
                {submitError && <div className="text-red-500 mt-4 text-center">{submitError}</div>}
                {submitResult && (
                  <div className="mt-6 bg-gray-100 p-4 rounded w-full">
                    <h3 className="font-semibold mb-2">Submission Result:</h3>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(submitResult, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}