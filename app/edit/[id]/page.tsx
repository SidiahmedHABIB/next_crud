"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function EditPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    console.log(formData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingForm(true);
        console.log("id:", params.id);
        const response = await fetch(`/api/interpretations/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch interpretation");
        }
        const data = await response.json();
        setFormData({
          term: data.interpretation.term,
          interpretation: data.interpretation.interpretation,
        });
      } catch (error) {
        setError("Failed to load interpretation.");
      } finally {
        setIsLoadingForm(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!formData.term || !formData.interpretation) {
      setError("Please fill in all the fields");
      
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/interpretations/${params.id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update  interpretation");
      }
      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoadingForm ? (
        <p> Loading Edit Page....</p>
      ) : (
        <div>
          <h2 className="text-2xl font-bold">Edit Interpretation</h2>
          <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
            <input
              type="text"
              name="term"
              placeholder="Term"
              value={formData.term}
              onChange={handleInputChange}
              className="py-1 px-4 border rounded-md"
            />
            <textarea
              name="interpretation"
              rows={4}
              placeholder="Interpretation"
              className="py-1 px-4  border rounded-md risize-none"
              value={formData.interpretation}
              onChange={handleInputChange}
            ></textarea>
            <button
              className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Upadate Interpretation"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
