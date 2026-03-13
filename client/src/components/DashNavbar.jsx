import { MdOutlineLogout } from "react-icons/md";
export default function DashNavbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="h-16 flex items-center justify-end py-7 px-10  border-b border-zinc-800 bg-zinc-900 text-white">
      <button
        onClick={logout}
        className="bg-primary text-black px-4 py-2 text-sm rounded-full cursor-pointer hover:scale-105 transition-all duration-300 flex justify-center items-center gap-2 "
      >
        Logout
        <MdOutlineLogout size={20} />
      </button>
    </div>
  );
}
