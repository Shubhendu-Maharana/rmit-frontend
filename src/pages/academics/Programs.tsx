import { FaUsers } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { LiaIndustrySolid } from "react-icons/lia";

const Programs = () => {
  // Sample data for programs
  type Program = {
    name: string;
    description: string;
    image: string;
    color: string;
  };

  type ProgramCategories = {
    degrees: Program[];
    diplomas: Program[];
    iti: Program[];
  };

  const programs: ProgramCategories = {
    degrees: [
      {
        name: "Bachelor of Computer Applications",
        description:
          "Learn computer applications, software development, and programming languages.",
        image: "https://picsum.photos/500/500",
        color: "from-green-500 to-primary-600",
      },
      {
        name: "Bachelor of Environmental Science",
        description:
          "Study environmental science, sustainability practices, and ecological conservation.",
        image: "https://picsum.photos/500/500",
        color: "from-yellow-500 to-green-600",
      },
    ],
    diplomas: [
      {
        name: "Civil Engineering",
        description:
          "Study structural analysis, design, construction, and maintenance of infrastructure.",
        image: "https://picsum.photos/500/500",
        color: "from-yellow-500 to-green-600",
      },
      {
        name: "Electrical Engineering",
        description:
          "Learn electrical circuits, electronics, power systems, and communication systems.",
        image: "https://picsum.photos/500/500",
        color: "from-yellow-500 to-amber-600",
      },
      {
        name: "Mechanical Engineering",
        description:
          "Develop skills in designing, manufacturing, and maintaining mechanical systems.",
        image: "https://picsum.photos/500/500",
        color: "from-red-500 to-rose-600",
      },
      {
        name: "Computer Science",
        description:
          "Explore the design, development, and testing of software and hardware systems.",
        image: "https://picsum.photos/500/500",
        color: "from-cyan-500 to-primary-600",
      },
    ],
    iti: [
      {
        name: "Electrician",
        description:
          "Hands-on training in electrical systems installation, maintenance, and repair.",
        image: "https://picsum.photos/500/500",
        color: "from-yellow-500 to-amber-600",
      },
      {
        name: "Welding",
        description:
          "Learn various welding techniques and metal fabrication processes.",
        image: "https://picsum.photos/500/500",
        color: "from-red-500 to-rose-600",
      },
      {
        name: "Machinist",
        description:
          "Training in operating lathes, mills, and CNC machines to create precision parts.",
        image: "https://picsum.photos/500/500",
        color: "from-teal-500 to-emerald-600",
      },
      {
        name: "Automotive Technician",
        description:
          "Learn to diagnose, repair, and maintain various vehicle systems.",
        image: "https://picsum.photos/500/500",
        color: "from-primary-500 to-sky-600",
      },
    ],
  };

  // Component for individual program card
  const ProgramCard = ({ program }: { program: Program }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="relative">
        <img
          src={program.image}
          alt={program.name}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-[#00000088] backdrop-blur-sm rounded-tl-lg rounded-tr-lg">
          <div className="font-bold text-xl tracking-tight">{program.name}</div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-600 text-sm leading-relaxed text-justify">
          {program.description}
        </p>
      </div>
    </div>
  );

  // Section component for each program type
  type ProgramSectionProps = {
    title: string;
    description: string;
    programs: Program[];
    textColor: string;
  };
  const ProgramSection = ({
    title,
    description,
    programs,
    textColor,
  }: ProgramSectionProps) => (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-extrabold ${textColor}`}>{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto my-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <ProgramCard key={index} program={program} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-primary-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Academic Programs
          </h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Discover the right path for your educational journey with our
            diverse range of programs designed to empower your future.
          </p>
        </div>
      </header>

      <div className="py-12 px-4 bg-white shadow-inner">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center space-x-2 px-6 py-3 bg-primary-50 rounded-full text-primary-700">
              <GiGraduateCap size={24} />
              <span className="font-medium">Academic Excellence</span>
            </div>
            <div className="flex items-center space-x-2 px-6 py-3 bg-green-50 rounded-full text-green-700">
              <LiaIndustrySolid size={24} />
              <span className="font-medium">Industry Partnerships</span>
            </div>
            <div className="flex items-center space-x-2 px-6 py-3 bg-purple-50 rounded-full text-purple-700">
              <FaUsers size={24} />
              <span className="font-medium">Expert Faculty</span>
            </div>
          </div>
        </div>
      </div>

      <ProgramSection
        title="Degree Programs"
        description="Comprehensive education focused on theory and practical applications to prepare you for leadership roles."
        programs={programs.degrees}
        textColor="text-primary-700"
      />

      <div className="bg-gray-100 py-2">
        <div
          className="w-full h-16 bg-white"
          style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
        ></div>
      </div>

      <ProgramSection
        title="Diploma Programs"
        description="Specialized training designed to equip you with practical skills for today's job market."
        programs={programs.diplomas}
        textColor="text-purple-700"
      />

      <div className="bg-white py-2">
        <div
          className="w-full h-16 bg-gray-100"
          style={{ clipPath: "polygon(0 100%, 100% 0, 0 0)" }}
        ></div>
      </div>

      <ProgramSection
        title="ITI Programs"
        description="Hands-on technical instruction to prepare you for in-demand trades and technical careers."
        programs={programs.iti}
        textColor="text-green-700"
      />
    </div>
  );
};

export default Programs;
