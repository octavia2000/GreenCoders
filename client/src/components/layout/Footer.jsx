import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <footer className="bg-white text-gray-900">
      <div className="container mx-auto px-6 lg:px-16 xl:px-28 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Logo size="lg" showText={true} className="" />
            <p className="mt-4 text-sm leading-relaxed max-w-xs text-gray-700">
              We are a trusted e-commerce website which supports eco-friendly products and services.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <a href="#" className="hover:text-black text-sm">Twitter</a>
              <a href="#" className="hover:text-black text-sm">Facebook</a>
              <a href="#" className="hover:text-black text-sm">Instagram</a>
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-black">Bonus program</Link></li>
              <li><Link to="#" className="hover:text-black">Gift cards</Link></li>
              <li><Link to="#" className="hover:text-black">Credit and payment</Link></li>
              <li><Link to="#" className="hover:text-black">Service contracts</Link></li>
              <li><Link to="#" className="hover:text-black">Payment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Assistance to the buyer</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-black">Find an order</Link></li>
              <li><Link to="#" className="hover:text-black">Terms of delivery</Link></li>
              <li><Link to="#" className="hover:text-black">Exchange and return of goods</Link></li>
              <li><Link to="#" className="hover:text-black">Guarantee</Link></li>
              <li><Link to="#" className="hover:text-black">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@greencode.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Green Street, Eco City</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto px-6 lg:px-16 xl:px-28 py-6 text-center text-xs">
          <span>© {new Date().getFullYear()} GreenCode. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}


