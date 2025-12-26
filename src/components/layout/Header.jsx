import useAuthStore from "../../store/authStore";

export const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          {/* User info is now in sidebar */}
        </div>
      </div>
    </header>
  );
};
