import { Button } from "flowbite-react";
import video from "../../assets/public/Lawyer video background 2 - Nature Relaxing Music (720p, h264, youtube).mp4";

const Herosection = () => {
  return (
    <>
      <div className="relative h-[400px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src={video} type="video/mp4" />
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-50 px-5 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif">
            Experience You Can Rely On, Results You Deserve
          </h1>
          <h2 className="mt-4 text-lg sm:text-xl md:text-2xl font-sans">
            Rooted in experience, driven by integrity—Legacy Legal Services is here to protect your rights and secure your future.
          </h2>
          <div className="flex justify-center mt-8">
            <Button 
              href="/contact" 
              className="bg-red-800 px-6 py-3 text-lg sm:text-xl hover:bg-red-600 transition-transform duration-300 hover:scale-105"
            >
              CONSULT ONE OF OUR EXPERTS NOW
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Herosection;