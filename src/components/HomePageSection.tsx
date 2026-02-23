import { NavLink } from "react-router";

interface HomePageSectionProps {
  image: string;
  heading: string;
  para: string;
  linkText?: { text: string; link: string };
  isEven: boolean;
}

const HomePageSection = ({
  image,
  heading,
  para,
  linkText,
  isEven,
}: HomePageSectionProps) => {
  return (
    <section className={`py-16 px-4 ${isEven ? "bg-gray-100" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col items-center ${
            isEven ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          <div
            className={`md:w-1/2 w-full mb-8 md:mb-0 ${
              isEven ? "md:pr-8" : "md:pl-8"
            }`}
          >
            <div className="h-72 rounded-lg overflow-hidden relative group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 scale-100 group-hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">{heading}</h2>
            <p className="text-gray-700 mb-6 text-justify">{para}</p>
            {linkText && (
              <NavLink
                to={linkText.link}
                className="text-primary-600 font-semibold hover:text-primary-800"
              >
                {linkText.text}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageSection;
