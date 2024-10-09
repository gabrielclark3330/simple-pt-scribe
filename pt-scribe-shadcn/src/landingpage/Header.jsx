import { useState } from "react";
import PTScribeLogo from "../assets/ptscribefull.png";
import { Link } from "react-router-dom";

export default function Header({ items, links, itemSelected }) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src={PTScribeLogo}
            className="h-8"
            alt="PT-Scribe Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            PT-Scribe
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <a
            to="/app"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Start Free
          </a>
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => {
              setIsSideBarOpen(!isSideBarOpen);
            }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={
            "items-center justify-between w-full md:flex md:w-auto md:order-1"
          }
          hidden={!isSideBarOpen}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            {items.map((element, index) => {
              var linkClassName = "";
              if (itemSelected === index) {
                linkClassName =
                  "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:p-0 md:text-blue-700";
              } else {
                linkClassName =
                  "block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent rounded md:bg-transparent md:p-0 md:hover:text-blue-700";
              }
              return (
                <li key={index+1}>
                  <a
                    href=""
                    className={linkClassName}
                    onClick={(event)=>{event.preventDefault();links[index].current.scrollIntoView({behavior: 'smooth'});}}
                  >
                    {element}
                  </a>
                </li>
              );
            })}
              <li key={0}>
                <Link
                  to="/app/login"
                  className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent rounded md:bg-transparent md:p-0 md:hover:text-blue-700"
                >
                  Login
                </Link>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
