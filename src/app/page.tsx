"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import classNames from "classnames";

const ITEMS_PER_PAGE = 5;

interface Company {
  id: number;
  name: string;
}

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const { scrollY } = useScroll();
  const [isAtTop, setIsAtTop] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsAtTop(latest > 0);
    });
  }, [scrollY]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCompanyElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/companies`);
        if (!res.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await res.json();
        setCompanies(data);
      } catch (error: unknown) {
        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
          setError(error.message); // Safely use the error message
        } else {
          setError("An unknown error occurred"); // Handle cases where error is not an instance of Error
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((companyId) => companyId !== id) : [...prev, id]
    );
  };

  const handleDeleteRequest = () => {
    // Filter out the selected companies from the list
    setCompanies((prevCompanies) =>
      prevCompanies.filter((company) => !selectedCompanies.includes(company.id))
    );
    // Reset the selected companies after deletion
    setSelectedCompanies([]);
  };

  const visibleCompanies = companies.slice(0, page * ITEMS_PER_PAGE);
  const allDataIsVisible = visibleCompanies.length >= companies.length;

  return (
    <div className='container mx-auto p-4'>
      <motion.header
        className='text-2xl font-bold mb-4 text-white flex justify-between items-center sticky top-0 bg-gradient-title z-10 px-6'
        style={{
          borderRadius: isAtTop ? "0 0 8px 8px" : "8px",
        }}
      >
        Company Dashboard
        <button
          onClick={handleDeleteRequest}
          className='text-white hover:bg-medium-brown transition p-4 rounded-r-lg cursor-pointer'
          disabled={selectedCompanies.length === 0}
          test-id={`selected-${selectedCompanies.length}`}
        >
          Delete Selected{selectedCompanies.length > 0 && ` (${selectedCompanies.length})`}
        </button>
      </motion.header>
      {loading && page === 1 ? (
        <p className='text-medium-brown'>Loading...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <div className='px-6 py-3'>
          <div className='grid grid-cols-12 gap-5'>
            <AnimatePresence initial={false}>
              {visibleCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  data-testid={`company-${company.id}`}
                  ref={index === visibleCompanies.length - 1 ? lastCompanyElementRef : null}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                  }}
                  className={classNames(
                    selectedCompanies.includes(company.id) ? "selected" : "",
                    "col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-light-brown shadow-md p-4 rounded-lg flex flex-col items-start cursor-pointer"
                  )}
                  onClick={() => handleSelect(company.id)}
                >
                  <div className='flex items-center space-x-4'>
                    <input
                      type='checkbox'
                      checked={selectedCompanies.includes(company.id)}
                      className='h-4 w-4 text-medium-brown cursor-pointer'
                      onChange={() => handleSelect(company.id)}
                    />
                    <span className='text-lg font-semibold text-dark-brown'>{company.name}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {loading && <p className='mt-4 text-medium-brown'>Loading more companies...</p>}
          {allDataIsVisible && <p className='mt-4 text-medium-brown'>No more companies to load</p>}
        </div>
      )}
    </div>
  );
}
