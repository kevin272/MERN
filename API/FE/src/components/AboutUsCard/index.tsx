import Heading1 from "../common/title";
import { Button } from "flowbite-react";
import logo from "../../assets/logo.svg";

const Aboutus = () => {
  return (
    <>
      <br />
      <Heading1>About Us</Heading1>
      <br />
      <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-100">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img
            src={logo}
            alt="SajhaBiz"
            className="w-3/4 h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h2 className="text-[30px] font-bold mb-4 font-serif">
            Empowering Local Dreams: Crowdfunding for Nepal’s Businesses
          </h2>
          <p className="text-lg text-gray-700 text-justify">
            SajhaBiz is a community-powered crowdfunding platform built to uplift and empower small and local businesses across Nepal. Our mission is to connect passionate entrepreneurs with supportive backers who believe in the power of local innovation and economic growth.
            <br /><br />
            Whether you're starting a homestay in the hills, a tech startup in the city, or a sustainable farm in the valleys, SajhaBiz provides the tools, visibility, and funding support you need to bring your business to life.
            <br /><br />
            Together, we are building a stronger, self-reliant Nepal — one idea, one business, one contribution at a time.
          </p>
          <br />
          <div className="flex justify-end">
            <Button
              href="/aboutus"
              style={{ width: 200, height: 45 }}
              className="bg-red-800 hover:bg-red-600 transition-transform duration-300 hover:scale-105"
            >
              READ MORE ABOUT US
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutus;
