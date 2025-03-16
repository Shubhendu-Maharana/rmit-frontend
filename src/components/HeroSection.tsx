interface HeroSectionProps {
  HeroImage: string;
}

const HeroSection = ({ HeroImage }: HeroSectionProps) => {
  return (
    <section
      className="h-96 flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: `url(${HeroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#000000aa] backdrop-blur-md md:p-8 p-4 rounded-lg max-w-3xl md:mx-0 mx-5">
        <h1 className="md:text-4xl text-3xl font-bold mb-4">
          Welcome to Rajiv Memorial Institute of Technology
        </h1>
        <p className="md:text-xl text-lg">
          Discover a world of opportunity, innovation, and excellence
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
