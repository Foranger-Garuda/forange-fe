"use client";
import React, { useState, useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { apiFetch } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/lib/ProtectedRoute";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResult(null);
    setError("");
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    setResult(null);
    setError("");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError("");
    if (!file) {
      setError("Please select an image file.");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG, and WEBP files are allowed.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const data = await apiFetch("/soil/analyze", {
        method: "POST",
        body: formData,
      });
      console.log("Backend result:", data);
      setResult(data);
      sessionStorage.setItem(
        "uploadResult",
        JSON.stringify({ result: data, fileName: file.name, previewUrl })
      );
      console.log(
        "sessionStorage uploadResult:",
        sessionStorage.getItem("uploadResult")
      );
      router.push("/upload/result");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Upload failed");
      } else {
        setError("Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#138048]">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Upload</h2>
          <form onSubmit={handleUpload} className="w-full flex flex-col items-center gap-6">
            <div
              className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-10 cursor-pointer transition-colors ${
                dragActive ? "border-[#138048] bg-green-50" : "border-gray-300 bg-gray-50"
              }`}
              onClick={handleBrowse}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FiUploadCloud className="text-5xl text-[#138048] mb-4" />
              <div className="text-lg font-medium mb-1">
                Drag & drop files or <span className="text-[#138048] underline cursor-pointer">Browse</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Supported formats: JPG, JPEG, PNG, WEBP
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden"
              />
              {file && (
                <div className="mt-4 w-full flex flex-col items-center">
                  <div className="text-sm text-gray-700 bg-white border rounded px-3 py-1 mb-2 w-full text-center">
                    {file.name}
                  </div>
                  {loading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-[#138048] h-2.5 rounded-full animate-pulse" style={{ width: "100%" }} />
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#138048] text-white font-bold py-2 rounded hover:bg-[#0f6a3a] transition"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>
          </form>
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
          {result && (
            <div className="mt-6 bg-gray-100 p-4 rounded w-full">
              <h3 className="font-semibold mb-2">Analysis Result:</h3>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
