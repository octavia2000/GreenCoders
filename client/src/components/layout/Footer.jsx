import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import twitterIcon from "../../assets/images/twitter.svg";
import facebookIcon from "../../assets/images/facebook.svg";
import tiktokIcon from "../../assets/images/tiktok.svg";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-[5rem]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700 px-[7rem]">
        <div className="flex flex-col justify-between">
          <p className="max-w-xs">
            We are a trusted e-commerce website which supports eco-friendly
            products and services
          </p>
          <div className="flex space-x-4 mt-4">
            <Link to="/" className="hover:opacity-70">
              <img src={twitterIcon} alt="Twitter" className="w-5 h-5" />
            </Link>
            <Link to="/" className="hover:opacity-70">
              <img src={facebookIcon} alt="Facebook" className="w-5 h-5" />
            </Link>
            <Link to="/" className="hover:opacity-70">
              <img src={tiktokIcon} alt="TikTok" className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bonus-program" className="hover:text-blue-500">
                  Bonus program
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="hover:text-blue-500">
                  Gift cards
                </Link>
              </li>
              <li>
                <Link to="/credit-payment" className="hover:text-blue-500">
                  Credit and payment
                </Link>
              </li>
              <li>
                <Link to="/service-contracts" className="hover:text-blue-500">
                  Service contracts
                </Link>
              </li>
              <li>
                <Link to="/non-cash-account" className="hover:text-blue-500">
                  Non-cash account
                </Link>
              </li>
              <li>
                <Link to="/payment" className="hover:text-blue-500">
                  Payment
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Assistance to the buyer</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="hover:text-blue-500">
                  Find an order
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-blue-500">
                  Terms of delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-blue-500">
                  Exchange and return of goods
                </Link>
              </li>
              <li>
                <Link to="/guarantee" className="hover:text-blue-500">
                  Guarantee
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-500">
                  Frequently asked questions
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-500">
                  Terms of use of the site
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
