"use client";

import Link from "next/link";
const Navbar = () => {
  // const Navbar = () => {
  return (
    <nav className="fixed z-10 top-0 bg-gray-50 text-gray-800 w-full p-4 grid grid-cols-3 items-center">
      <a href="/" className={`text-center`}>
        AI-41
      </a>
      <p className={`text-center`}>AI FOR EVERYONE</p>
      <div className="hidden">
        <Link href="/">Home 🏡 </Link>
        {/* New Page: */}
        {/* E.g. For a new link to  app/newpage/page.jsx */}
        {/* <Link href="/[APP_FOLDER_NAME]">New Page 📄</Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
