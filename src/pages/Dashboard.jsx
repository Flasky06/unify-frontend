import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/layout/PageHeader";

const Dashboard = () => {
  const { user, logout, isLoggingOut } = useAuth();

  // Create business object from user data
  const business = user
    ? {
        businessName: user.businessName,
        businessType: user.businessType,
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">The Dashboard</h1>
            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <PageHeader
            title="Dashboard"
            subtitle={
              business
                ? `${business.businessName} - ${business.businessType}`
                : "Business Overview"
            }
          />

          {/* Context Message */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Welcome to your Dashboard
            </h2>
            <p className="text-gray-600">
              You are logged in as a <strong>{user?.role}</strong>.
            </p>
            {user?.role === "BUSINESS_OWNER" && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Business Name: {user.businessName}
                </p>
                <p className="text-sm text-gray-500">
                  Business Type: {user.businessType}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
