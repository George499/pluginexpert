import { Toaster } from "react-hot-toast";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center bg-[url('/images/bkground_1.png')]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileForm />
        </div>
        <Toaster position="top-right" />
      </div>
    </ProtectedRoute>
  );
}

export default App;
