"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        router.replace("/auth/signin");
        return;
      }

      try {
        const res = await fetch("https://admin.pluginexpert.ru/api/users/me", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("authToken");
          router.replace("/auth/signin");
        }
      } catch (err) {
        localStorage.removeItem("authToken");
        router.replace("/auth/signin");
      }
    };

    validateToken();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-[url('/images/bkground_1.png')] bg-cover bg-fixed">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
