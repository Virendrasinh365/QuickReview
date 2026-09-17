import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import { getPublicBusiness, generateReview } from "../services/publicApi";

import BusinessHeader from "../components/BusinessHeader";
import RatingSelector from "../components/RatingSelector";
import LanguageSelector from "../components/LanguageSelector";
import ServiceSelector from "../components/ServiceSelector";
import ExperienceInput from "../components/ExperienceInput";
import GenerateButton from "../components/GenerateButton";
import ReviewCard from "../components/ReviewCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const CustomerReview = () => {
    const { slug } = useParams();

    const [business, setBusiness] = useState(null);
    const [services, setServices] = useState([]);

    const [rating, setRating] = useState(5);
    const [language, setLanguage] = useState("English");
    const [selectedServices, setSelectedServices] = useState([]);
    const [experience, setExperience] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedReview, setGeneratedReview] = useState("");
    const [generationError, setGenerationError] = useState("");

    useEffect(() => {
        const loadBusiness = async () => {
            try {
                const result = await getPublicBusiness(slug);
                if (result.success) {
                    setBusiness(result.data.business);
                    setServices(result.data.services);
                    if (result.data.business.languages?.length > 0) {
                        setLanguage(result.data.business.languages[0]);
                    }
                } else {
                    setError("We couldn't find this business. The link might be invalid.");
                }
            } catch (err) {
                console.error(err);
                setError("Unable to load business information right now. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadBusiness();
    }, [slug]);

    const handleGenerate = async () => {
        if (!selectedServices.length) {
            setGenerationError("Please select at least one experience/service.");
            return;
        }
        
        setIsGenerating(true);
        setGenerationError("");
        setGeneratedReview("");
        
        try {
            const result = await generateReview({
                slug,
                rating,
                language,
                serviceIds: selectedServices,
                experience
            });
            
            if (result.success && result.data && result.data.review) {
                setGeneratedReview(result.data.review);
            } else {
                setGenerationError("Failed to generate review. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setGenerationError(err.response?.data?.message || "An error occurred while generating the review.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error || !business) {
        return (
            <div className="review-page" style={{ justifyContent: "center" }}>
                <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
                    <AlertCircle size={48} color="#ef4444" style={{ marginBottom: "16px" }} />
                    <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>Oops!</h2>
                    <p style={{ color: "var(--text-muted)" }}>{error || "Business not found."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="review-page">
            <div className="review-wrapper animate-fade-in-up">
                
                <BusinessHeader business={business} />

                <div className="premium-card">
                    <RatingSelector rating={rating} setRating={setRating} />

                    {business.languages?.length > 0 && (
                        <LanguageSelector
                            languages={business.languages}
                            language={language}
                            setLanguage={setLanguage}
                        />
                    )}

                    {services.length > 0 ? (
                        <ServiceSelector
                            services={services}
                            selectedServices={selectedServices}
                            setSelectedServices={setSelectedServices}
                        />
                    ) : (
                        <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", background: "var(--background)", borderRadius: "var(--radius-sm)" }}>
                            No specific services listed. Just tell us about your experience below!
                        </div>
                    )}

                    <ExperienceInput 
                        experience={experience} 
                        setExperience={setExperience} 
                    />

                    {generationError && (
                        <div className="animate-fade-in" style={{ 
                            color: "#b91c1c", 
                            background: "#fef2f2", 
                            padding: "12px", 
                            borderRadius: "var(--radius-sm)", 
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            <AlertCircle size={16} />
                            {generationError}
                        </div>
                    )}

                    <GenerateButton 
                        onClick={handleGenerate} 
                        disabled={isGenerating || (services.length > 0 && selectedServices.length === 0)}
                        isGenerating={isGenerating}
                    />
                </div>

                {generatedReview && (
                    <ReviewCard 
                        review={generatedReview}
                        business={business}
                        onRegenerate={handleGenerate}
                        isGenerating={isGenerating}
                    />
                )}

                <div className="powered-by">
                    Powered by <span style={{ fontWeight: "700", color: "var(--primary)" }}>EazyReview</span>
                </div>
            </div>
        </div>
    );
};

export default CustomerReview;