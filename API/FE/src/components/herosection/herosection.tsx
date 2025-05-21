import { Button } from "flowbite-react";
import video from "../../assets/public/video.mp4"; // Assuming the video path is correct

const Herosection = () => {
  return (
    <>
      <div className="relative h-[450px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden rounded-b-3xl shadow-xl">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline // Added for better mobile compatibility
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay and Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center h-full text-white 
                        bg-gradient-to-br from-emerald-800/70 via-green-700/60 to-lime-600/50 
                        px-4 sm:px-6 lg:px-8 text-center rounded-b-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Empowering Dreams, Growing Communities
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-light max-w-3xl leading-relaxed drop-shadow-md">
            SajhaBiz connects innovative local businesses with passionate supporters, turning ideas into impact across Nepal.
          </p>
          <div className="flex justify-center mt-10">
            <Button 
              href="/campaign" // Link to public campaigns page
              className="bg-white text-emerald-800 px-8 py-4 text-lg sm:text-xl font-bold 
                         rounded-full shadow-lg hover:bg-emerald-50 transition-all duration-300 
                         transform hover:scale-105 focus:ring-4 focus:ring-emerald-300 focus:ring-offset-2
                         border-2 border-emerald-800"
            >
              EXPLORE CAMPAIGNS
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Herosection;