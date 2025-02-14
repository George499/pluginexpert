"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  return (
    <header className="w-full h-24 bg-transparent items-center flex absolute top-0 left-0 z-50">
      <div className="w-[80%] lg:w-2/3 mx-auto">
        <div className="w-full flex justify-between items-center text-white font-bold text-base">
          <div className="z-20">
            <Link href="/" className="cursor-pointer tracking-wide text-[15px]">
              PLUG-IN
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
