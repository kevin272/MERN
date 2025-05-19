import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button } from "flowbite-react";
import TeamSvc from "../../pages/Our Team/team.service";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/common/loading/loading.component";

const OurTeamComponent = () => {
  const [members, setMembers] = useState<any | null>(null);

  const fetchTeamMembers = async () => {
    try {
      const response: any = await TeamSvc.getRequest("/member/list-home");
      setMembers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return (
    <>
    <section className="py-12 bg-white-800">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-red-800">
          Meet Our Legal Experts
        </h1>
        <p className="text-center text-red-800 mt-2">
          Experienced professionals dedicated to your success.
        </p>
        
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {/* Ensure members data exists and is an array before mapping */}
            {members && Array.isArray(members) ? (
              members.map((member: any, index: number) => (
                <div
                  key={index}
                  className="bg-white text-red-800 shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
                >
                 <a href={`/ourteam/${member._id}`}>               
                  <img
                    
                    src={member.image}
                    alt={member.fullname}
                    className="w-full h-72 object-cover rounded-md"
                  />
                  </a>
                  <h2 className="text-xl font-semibold mt-4">{member.fullname}</h2>
                  <p className="text-gray-800">{member.title}</p>
                  <p className="text-sm text-gray-600 mt-2">{member.expertise}</p>

                  <div className="flex justify-center gap-4 mt-4">
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-800 hover:text-gray-700 transition text-2xl"
                    >
                      <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-800 hover:text-gray-700 transition text-2xl"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-800 hover:text-gray-700 transition text-2xl"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-red-800 hover:text-gray-700 transition text-2xl"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <LoadingComponent/>
            )}
          </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          href="/contact"
          style={{ width: 200, height: 45 }}
          className="bg-red-800 size-3/12 hover:bg-red-600 transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-2"
        >
          <span className="text-white">CONTACT US NOW!</span>
        </Button>
      </div>
    </section>
    </>);
};

export default OurTeamComponent;
