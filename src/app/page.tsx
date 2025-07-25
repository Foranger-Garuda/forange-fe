"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/lib/ProtectedRoute";
import Loading from "@/components/Loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  const handleActionClick = () => {
    setIsLoading(true);
    if (token) {
      router.push("/upload");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <div
        className="bg-cover bg-center min-h-screen flex flex-col items-center text-center"
        style={{ backgroundImage: "url('/bg-landing.png')" }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <p className="lg:text-9xl leading-[0] mt-30 text-primary-sea-green text-6xl">
              “
            </p>
            <h1 className="lg:text-5xl leading-tight font-bold text-3xl">
              Discover what grows
              <br />
              where you are.
            </h1>
            <p className="lg:text-2xl leading-snug lg:mt-1 mt-5 text-sm">
              Grounded decisions begin with{" "}
              <img src="/gro-text.svg" className="lg:h-7 h-5 inline align-bottom" />
            </p>
            <button
              onClick={handleActionClick}
              className="mt-5 lg:text-l text-sm px-3 py-2 bg-primary-sea-green text-bold text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
            >
              {token ? (
                <>
                  Begin discovering{" "}
                  <svg
                    width="20"
                    height="18"
                    viewBox="0 0 28 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.9099 5.87866H19.8529V3.85017C19.8529 2.95352 19.4968 2.0936 18.8627 1.45958C18.2287 0.825552 17.3688 0.46936 16.4721 0.46936H12.4152C11.5185 0.46936 10.6586 0.825552 10.0246 1.45958C9.39054 2.0936 9.03435 2.95352 9.03435 3.85017V5.87866H4.97738C3.90141 5.87866 2.8695 6.30609 2.10867 7.06692C1.34784 7.82775 0.92041 8.85965 0.92041 9.93563V20.7542C0.92041 21.8302 1.34784 22.8621 2.10867 23.6229C2.8695 24.3838 3.90141 24.8112 4.97738 24.8112H23.9099C24.9859 24.8112 26.0178 24.3838 26.7786 23.6229C27.5395 22.8621 27.9669 21.8302 27.9669 20.7542V9.93563C27.9669 8.85965 27.5395 7.82775 26.7786 7.06692C26.0178 6.30609 24.9859 5.87866 23.9099 5.87866ZM11.739 3.85017C11.739 3.67084 11.8102 3.49886 11.937 3.37205C12.0638 3.24525 12.2358 3.17401 12.4152 3.17401H16.4721C16.6515 3.17401 16.8234 3.24525 16.9503 3.37205C17.0771 3.49886 17.1483 3.67084 17.1483 3.85017V5.87866H11.739V3.85017ZM14.4436 20.0781C13.5075 20.0781 12.5924 19.8005 11.8141 19.2804C11.0357 18.7603 10.429 18.0211 10.0708 17.1562C9.71256 16.2913 9.61883 15.3397 9.80146 14.4215C9.98409 13.5034 10.4349 12.66 11.0968 11.9981C11.7588 11.3362 12.6021 10.8854 13.5203 10.7027C14.4384 10.5201 15.3901 10.6138 16.2549 10.9721C17.1198 11.3303 17.859 11.937 18.3791 12.7153C18.8992 13.4937 19.1768 14.4088 19.1768 15.3449C19.1768 16.6002 18.6781 17.8041 17.7905 18.6918C16.9028 19.5794 15.699 20.0781 14.4436 20.0781V20.0781Z"
                      fill="#FAFAFF"
                    />
                  </svg>
                </>
              ) : (
                <>
                  Login to start{" "}
                  <svg
                    width="20"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12L10 7M15 12H3"
                      stroke="#FAFAFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </>
        )}
      </div>
      <section className="bg-primary-sea-green py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
            Upload Guidelines & FAQ
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="item-1"
              className="bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                What types of soil images work best?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                For best results, upload clear, well-lit photos of soil taken
                during daylight. Ensure the soil surface is visible and not
                covered by vegetation. Close-up shots work better than distant
                ones.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                What file formats are supported?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                We support JPG, JPEG, PNG, and WEBP image formats. Higher
                resolution images typically provide more accurate analysis
                results.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                How long does the analysis take?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Most soil analyses complete within 5-15 seconds. Processing time
                may vary based on image size and server load. You'll be
                automatically redirected to the results page once analysis is
                complete.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                What if my analysis results seem incorrect?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                You can manually adjust any analysis results on the results page
                using the dropdown menus. This helps improve accuracy and allows
                you to incorporate your local knowledge about the soil
                conditions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                Is my uploaded image data stored?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Images are processed securely and not permanently stored on our
                servers. Analysis results are temporarily saved in your browser
                session for your convenience but are not linked to personal
                data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                Can I upload multiple images at once?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Currently, we support single image uploads. For multiple soil
                samples, please upload and analyze each image separately. This
                ensures the most accurate results for each specific location.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-7"
              className="bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                What should I do if upload fails?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Check your internet connection and ensure your image meets the
                file format and size requirements. If the problem persists, try
                refreshing the page or using a different image format.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
