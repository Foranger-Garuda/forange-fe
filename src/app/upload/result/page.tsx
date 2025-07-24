"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ResultPage() {
  const [soilColor, setSoilColor] = useState("Brown");
  const [soilTexture, setSoilTexture] = useState("Sandy");
  const [soilDrainage, setSoilDrainage] = useState("Well-Drained");
  const [soilLocationType, setSoilLocationType] = useState("Well-Drained");
  const [soilFertility, setSoilFertility] = useState("High");
  const [soilMoisture, setSoilMoisture] = useState("Wet");

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
            <div className="rounded-xl p-6 relative h-full">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat rounded-xl"
                style={{ backgroundImage: "url('/result-example.png')" }}
              ></div>
            </div>
          </div>

          {/* Right Panel - AI Analysis Results */}
          <div className="flex-1">
            <div className="bg-primary-brunswick-green rounded-xl p-6 shadow-2xl h-full">
              <h2 className="text-white text-2xl font-bold text-center mb-6">
                AI Analysis Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Dropdown
                  label="Soil Color"
                  value={soilColor}
                  setValue={setSoilColor}
                  options={["Brown", "Black", "Red", "Gray", "Yellow"]}
                />

                <Dropdown
                  label="Soil Location Type"
                  value={soilLocationType}
                  setValue={setSoilLocationType}
                  options={[
                    "Well-Drained",
                    "Poorly-Drained",
                    "Waterlogged",
                    "Dry",
                  ]}
                />

                <Dropdown
                  label="Soil Texture"
                  value={soilTexture}
                  setValue={setSoilTexture}
                  options={["Sandy", "Clay", "Loam", "Silt", "Rocky"]}
                />

                <Dropdown
                  label="Soil Fertility"
                  value={soilFertility}
                  setValue={setSoilFertility}
                  options={["High", "Medium", "Low", "Very High", "Very Low"]}
                />

                <Dropdown
                  label="Soil Drainage"
                  value={soilDrainage}
                  setValue={setSoilDrainage}
                  options={["Well-Drained", "Moderate", "Poor", "Excellent"]}
                />

                <Dropdown
                  label="Soil Moisture"
                  value={soilMoisture}
                  setValue={setSoilMoisture}
                  options={["Wet", "Moist", "Dry", "Very Wet", "Very Dry"]}
                />
              </div>

              <Button
                className="w-full p-4 bg-primary-sea-green hover:bg-white text-white hover:text-primary-sea-green font-bold rounded-md transition-colors duration-200"
                size="lg"
              >
                Refine Soil Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
