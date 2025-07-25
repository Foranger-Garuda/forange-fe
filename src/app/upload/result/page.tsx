"use client";

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
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

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
  const router = useRouter();

  // Dynamically import MapContainer and related components to avoid SSR issues
  const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
  const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
  const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

  useEffect(() => {
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
  }, [router]);

  useEffect(() => {
    // Try to get user location on mount
    setLocationLoading(true);
    setLocationError("");
    if (navigator.geolocation) {
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
  }, []);

  // Custom component for picking location on the map
  function LocationPicker({ lat, lon, setLat, setLon }: { lat: number | null, lon: number | null, setLat: (v: number) => void, setLon: (v: number) => void }) {
    // eslint-disable-next-line
    require("react-leaflet").useMapEvents({
      click(e: { latlng: { lat: number; lng: number } }) {
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
      },
    });
    return lat && lon ? (
      <Marker
        position={[lat, lon] as LatLngExpression}
        // draggable is not a valid prop in react-leaflet v4+, use eventHandlers instead
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const position = marker.getLatLng();
            setLat(position.lat);
            setLon(position.lng);
          },
        }}
        icon={L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      />
    ) : null;
  }

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
      sessionStorage.setItem("cropResult", JSON.stringify(data));
      window.location.href = "/upload/crop-result";
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
                      <MapContainer
                        center={[(lat ?? -6.2), (lon ?? 106.8)] as LatLngExpression}
                        zoom={13}
                        style={{ height: 300, width: "100%" }}
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          // Remove invalid 'attribution' prop if not supported, or use correct prop if needed
                          attribution="&copy; OpenStreetMap contributors"
                        />
                        <LocationPicker lat={lat} lon={lon} setLat={setLat} setLon={setLon} />
                      </MapContainer>
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
  );
}
