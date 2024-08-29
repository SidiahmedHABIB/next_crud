"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
interface IInterpretation {
  $id: string;
  term: string;
  interpretation: string;
}
export default function Home() {
  const [interpretations, setinterpretations] = useState<IInterpretation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("api/interpretations");
        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();
        setinterpretations(data);
      } catch (error) {
        console.log("error: ", error);
        setError("Failed to load interpretations. Please try reload page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterpretations();
  }, []);
  const handlDelete = async (id: string) => {
    try {
      await fetch(`api/interpretations/${id}`, { method: "DELETE" });

      setinterpretations((prevInterpretations) =>
        prevInterpretations?.filter((i) => i.$id !== id)
      );
    } catch (error) {
      console.log("error: ", error);
      setError("Failed to delete interpretations. Please try again.");
    }
  };
  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p> Loading interpretations....</p>
      ) : interpretations?.length < 0 ? (
        <p> No Interpretations Found.</p>
      ) : (
        <div>
          {interpretations?.map((interpretation) => (
            // eslint-disable-next-line react/jsx-key
            <div className="p-4 my-2 rounded-md border-b leading-8">
              <div className="font-bold">{interpretation.term}</div>
              <div>{interpretation.interpretation}</div>

              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200  py-2 px-4 rounded-md uppercase text-sm font-bold tracking-widest"
                  href={`/edit/${interpretation.$id}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handlDelete(interpretation.$id)}
                  className="bg-red-500 text-white  py-2 px-4 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
