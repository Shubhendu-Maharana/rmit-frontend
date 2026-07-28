import HomePageSection from "../../components/HomePageSection";
import HeroSection from "../../components/HeroSection";

interface HomePageSectionData {
  image: string;
  heading: string;
  para: string;
  linkText?: {
    text: string;
    link: string;
  };
}

const Sections: HomePageSectionData[] = [
  {
    image:
      "https://sesyrjzioixzjrytxxqt.supabase.co/storage/v1/object/public/rmit-admin-assets/IMG_5591.jpg",
    heading: "Academic Excellence",
    para: "Discover the essence of academic excellence and innovation at Rajiv Memorial Institute of Technology, situated in the vibrant locale of Konisi, Berhampur. Our state-of-the-art campus provides an ideal backdrop for students seeking a dynamic learning environment. As we blend theoretical knowledge with practical skills, we offer a range of courses, including BCA, BES, Diploma in Civil, Computer Science, Mechanical, Electrical, and ITI. Join us on a transformative journey that not only imparts knowledge but also shapes character, preparing you for a successful future in the ever-evolving landscape of technology.",
    linkText: { text: "Explore Programs →", link: "/programs" },
  },
  {
    image:
      "https://sesyrjzioixzjrytxxqt.supabase.co/storage/v1/object/public/rmit-admin-assets/IMG_7077.jpg",
    heading: "Vibrant Campus Life",
    para: "Welcome to an institution dedicated to academic excellence, where state-of-the-art infrastructure supports a dynamic learning environment. The campus is thoughtfully designed to inspire innovation, encourage collaboration, and promote hands-on learning experiences.",
    linkText: { text: "Discover Campus Life →", link: "/campus-life" },
  },
  {
    image:
      "https://sesyrjzioixzjrytxxqt.supabase.co/storage/v1/object/public/rmit-admin-assets/IMG_7423.jpg",
    heading: "Recognized Affiliations",
    para: "Our programs are affiliated with esteemed institutions, ensuring academic excellence and industry relevance. The BCA and BES programs follow Berhampur University’s rigorous curriculum, while the Diploma and ITI programs, aligned with the State Council for Technical Education & Vocational Training, emphasize hands-on learning in fields like civil, computer science, mechanical, and electrical engineering.",
  },
];

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection HeroImage="https://sesyrjzioixzjrytxxqt.supabase.co/storage/v1/object/public/rmit-admin-assets/home-bg.jpg" />

      {/* Sections */}
      {Sections.map((section, index) => (
        <HomePageSection
          key={index}
          image={section.image}
          heading={section.heading}
          para={section.para}
          linkText={section.linkText}
          isEven={index % 2 === 0}
        />
      ))}
    </main>
  );
};

export default Home;
