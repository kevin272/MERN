import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button } from "flowbite-react";
import UserSvc from "../../pages/Our Team/user.service"; 
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/common/loading/loading.component";
import { Link } from "react-router-dom"; 

const OurTeamComponent = () => {
  const [members, setMembers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true); //loading state
  const fetchTeamMembers = async () => {
  try {
    const response: any = await UserSvc.getTeamMembersForHome();
    console.log("Public Team Members API Response:", response.result);
    setMembers(response.result || []);
    setLoading(false); 
  } catch (error) {
    console.error("Error fetching team members:", error);
    setLoading(false);
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
          Meet Our Team
        </h1>
        <p className="text-center text-red-800 mt-2">
          Experienced professionals dedicated to your success.
        </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {loading ? ( 
              <LoadingComponent/>
            ) : (
              members && Array.isArray(members) && members.length > 0 ? (
                members.map((member: any) => ( 
                  <div
                    key={member._id}
                    className="bg-white text-red-800 shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
                  >
                   <Link to={`/ourteam/${member._id}`}>
                      <img
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-72 object-cover rounded-md"
                        onError={(e:any) => { e.target.onerror = null; e.target.src="https://placehold.co/400x288/cccccc/000000?text=No+Image" }}
                      />
                    </Link>
                    <h2 className="text-xl font-semibold mt-4">{member.name}</h2>
                    <p className="text-gray-800">{member.role}</p> 
                    <p className="text-sm text-gray-600 mt-2">{member.expertise || member.bio}</p> 
                    <div className="flex justify-center gap-4 mt-4">
                      {member.facebook && ( 
                        <a
                          href={member.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-800 hover:text-gray-700 transition text-2xl"
                        >
                          <FontAwesomeIcon icon={faFacebook} />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-800 hover:text-gray-700 transition text-2xl"
                        >
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-800 hover:text-gray-700 transition text-2xl"
                        >
                          <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-red-800 hover:text-gray-700 transition text-2xl"
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-600 dark:text-gray-400 p-8">
                  No team members found at the moment.
                </div>
              )
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