import PTScribeLogo from "../assets/ptscribefull.png";

export default function Footer() {
  return (
    <footer className="p-4 md:p-8 lg:p-10">
      <div className="h-20"/>
      <div className="mx-auto max-w-screen-xl text-center">
        <a
          href="https://www.pt-scribe.com/"
          className="flex justify-center items-center text-2xl font-semibold text-gray-900"
        >
          <img
            src={PTScribeLogo}
            className="h-8 mr-2"
            alt="PT-Scribe Logo"
          />
          PT-Scribe
        </a>
        <p className="my-6 text-gray-500">
          An ambient AI Physical Therapy scribe for individuals and teams.
        </p>
        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900">
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">
              Campaigns
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Blog
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Affiliate Program
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              FAQs
            </a>
          </li>
        </ul>
        <span className="text-sm text-gray-500 sm:text-center">
          © 2023-2024{" "}
          <a href="#" className="hover:underline">
            PT-Scribe™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
