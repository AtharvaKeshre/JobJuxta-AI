"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../Button";



type Props = {
  title: string;
};

const NavBar: React.FC<Props> = ({ title }) => {
  const [activeItem, setActiveItem] = useState("");
  const navItems = ["Home", "About", "Contact", "Blog"];


  return (
    <nav className="h-16 flex flex-row justify-between items-center px-10">
      
      <Link href="/" className="text-2xl font-bold text-primary">
      <div className="text-3xl font-light text-shadow-lg shadow-white text-primary font-poppins">
        <h1>{title}</h1>
      </div>
      </Link>
      <div className="h-full ">
        <ul className="flex space-x-10 text-lg h-full">
          {navItems.map((item) => (
            <li key={item} className="relative border-b-2 border-transparent hover:border-b-2 hover:border-primary h-full flex items-center">
              <Link
                href={`/${
                  item.toLowerCase() === "home" ? "home" : item.toLowerCase()
                }`}
                onClick={() => setActiveItem(item)}
              >
                <span
                  className={` ${
                    activeItem === item ? "text-primary ": ""
                  }`}
                >
                  {item}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row items-center">
        {/* <div className="flex flex-row justify-center items-center border border-primary rounded-3xl p-2 bg-white gap-1.5 focus-within:border-primary">
          <Search size={20} className="text-primary" />
          <input
            type="text"
            placeholder="Search"
            className="focus:outline-none text-black"
            onChange={(e) => console.log(e.target.value)}
          />
        </div> */}
        <Link href="/signup" className="ml-4">
          <Button variant="primary" size="medium" className=" duration-500">
            SignIn
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary" size="medium" className="ml-2 hover:text-primary duration-500">
            LogIn
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
