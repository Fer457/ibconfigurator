import Image from "next/image";
import { WavyBackground } from "../components/ui/wavy-background";

const LandingPage: React.FC = () => {
  return (
    <div>
      <WavyBackground className="max-w-4xl mx-auto pb-40 flex flex-col items-center">
        <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
          IntecBot
        </p>
        <p className="text-base md:text-lg mt-4 text-gray-400 font-normal inter-var text-center">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet
          dolore, dolor rerum aliquam suscipit debitis?
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Iniciar sesión
          </button>
          <button className="px-4 py-2  text-white ">Contacto</button>
        </div>
      </WavyBackground>
    </div>
  );
};

export default LandingPage;
