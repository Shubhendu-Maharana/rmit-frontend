import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { NavLink } from "react-router";
import Logo from "../../assets/logo.png";

const socialMediaLinks = [
  { icon: <FaFacebook size={24} />, link: "https://www.facebook.com" },
  { icon: <FaInstagram size={24} />, link: "https://www.instagram.com" },
  { icon: <FaTwitter size={24} />, link: "https://www.twitter.com" },
  { icon: <FaYoutube size={24} />, link: "https://www.youtube.com" },
];

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex gap-4 items-center md:flex-row-reverse">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Rajiv Memorial Institute
                <br />
                of Technology
              </h3>
              <p className="text-primary-200">
                Near Govindpur, Konisi
                <br />
                Berhampur, Odisha
                <br />
                India
              </p>
            </div>
            <img src={Logo} alt="Logo" className="w-32 h-32" loading="lazy" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Programs", "Faculties", "Cultural & Cosmopolitan"].map(
                (link) => (
                  <li key={link}>
                    <NavLink
                      to={`/${link.toLowerCase().replace(" ", "")}`}
                      className="text-primary-200 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Notices", "Time Table"].map((link) => (
                <li key={link}>
                  <NavLink
                    to={`/${link.toLowerCase().replace(" ", "")}`}
                    className="text-primary-200 hover:text-white transition-colors duration-300"
                  >
                    {link}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialMediaLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  className="text-primary-200 hover:text-white transition-colors duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-800 pt-8 text-sm text-primary-200 text-center">
          <p>
            &copy; {new Date().getFullYear()} Rajiv Memorial Institute of
            Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
