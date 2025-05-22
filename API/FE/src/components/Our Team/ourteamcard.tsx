import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button } from "flowbite-react";
import UserSvc from "../../pages/Our Team/user.service"; // Assuming this is the correct service
import { useEffect, useState } from "react";
import Breadcrumbnavigation from "../common/breadcrumb navigation/breadcrumb component";
import LoadingComponent from "../common/loading/loading.component";
import { Link } from "react-router-dom";

const OurTeamComponent = () => {
  const [members, setMembers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeamMembers = async () => {
    try {
      const response: any = await UserSvc.getTeamMembersForHome();
      console.log("Public Team Members API Response:", response.result);
      setMembers(response.result); 
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
      <Breadcrumbnavigation>Our Team</Breadcrumbnavigation>
      <section className="py-10 bg-white dark:bg-gray-900"> 
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-semibold text-center text-green-600 dark:text-green-500"> 
            Meet Our Team
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-2"> 
            Dedicated professionals committed to your success.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {loading ? (
              <LoadingComponent />
            ) : members && Array.isArray(members) ? (
              members.map((member: any) => (
                <div
                  key={member._id}
                  className="bg-white dark:bg-gray-800 rounded-md shadow-sm border dark:border-gray-700"
                >
                  <Link to={`/ourteam/${member._id}`}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover rounded-t-md"
                      onError={(e: any) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/cccccc/000000?text=No+Image"; }}
                    />
                  </Link>
                  <div className="p-3"> 
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{member.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{member.title}, {member.expertise}</p>
                    <div className="flex justify-start mt-3 gap-2"> 
                      {member.facebook && (
                        <a
                          href={member.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-500 transition text-lg"
                        >
                          <FontAwesomeIcon icon={faFacebook} />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-500 transition text-lg"
                        >
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-500 transition text-lg"
                        >
                          <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-green-600 hover:text-green-500 transition text-lg"
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 p-6">
                No team members found at the moment.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            href="/contact"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            CONTACT US NOW!
          </Button>
        </div>
      </section>
    </>
  );
};

export default OurTeamComponent;