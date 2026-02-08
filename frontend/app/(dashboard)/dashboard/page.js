import { Toaster } from "react-hot-toast";
import ProfileForm from "@/components/dashboard/ProfileForm";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex items-start justify-center bg-[url('/images/bkground_1.png')] bg-cover bg-fixed">
        <div className="max-w-7xl w-full mx-auto">
          <ProfileForm />
        </div>
        <Toaster position="top-right" />
      </div>
    </ProtectedRoute>
  );
}

export default App;
