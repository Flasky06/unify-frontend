import useAuthStore from "../../store/authStore";

export const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 relative">
      <div className="flex items-center justify-end w-full h-full min-h-[24px]">
        <button
          className="lg:hidden absolute top-3 right-4 p-2 text-gray-600 hover:bg-gray-100 rounded-md z-50"
          style={{ position: "absolute", right: "1rem", top: "0.75rem" }}
          onClick={onMenuClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
