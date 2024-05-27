"use client";

import Image from "next/image";
import { BackgroundBeams } from "../components/ui/background-beans";
import { BorderBeam } from "../components/ui/border-beam";
import TypingAnimation from "../components/ui/typing-animation";

const LoginPage: React.FC = () => {
  return (
    <div className="h-screen w-full bg-black relative flex flex-col items-center justify-center">
      <BackgroundBeams />
      <div className="flex flex-col items-center justify-center px-6 py-8 w-[500px] mx-auto lg:py-0">
        <a
          href="#"
          className="flex items-center gap-4 mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            src="/intecrobots_dark.png"
            width={120}
            height={50}
            alt={"intecrobots logo"}
          />
        </a>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-black/90 relative border border-gray-900">
          <BorderBeam />
          <div className="space-y-4 md:space-y-6 sm:p-8 z-10 relative">
            <TypingAnimation
              className="text-3xl font-bold text-white"
              text="Inicia sesión en IntecBot"
            />
            <form
              className="space-y-4 md:space-y-6 flex flex-col items-center w-full"
              action="#"
            >
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="rounded-lg text-sm block w-full p-2.5 dark:bg-zinc-800 border-gray-600 placeholder-gray-400 text-white"
                  placeholder="name@company.com"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••••••"
                  className="rounded-lg text-sm block w-full p-2.5 dark:bg-zinc-800 border-gray-600 placeholder-gray-400 text-white"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-[#3b82f6] hover:underline"
                >
                  ¿Has olvidado la contraseña?
                </a>
              </div>
              <button
                type="submit"
                className="text-white font-semibold rounded-md text-sm bg-blue-700 hover:bg-blue-500"
              >
                Iniciar sesión
              </button>
              <p className="text-sm font-light text-gray-300">
                ¿No tienes cuenta?{" "}
                <a
                  href="#"
                  className="font-medium hover:underline text-[#3b82f6]"
                >
                  Contáctanos
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
