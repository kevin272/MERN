import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button } from "flowbite-react";
import UserSvc from "../../pages/Our Team/user.service";
import LoadingComponent from "../../components/common/loading/loading.component";

interface TeamMember {
  _id: string;
  name: string;
  role?: string;
  expertise?: string;
  bio?: string;
  image?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

const OurTeamComponent = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response: any = await UserSvc.getTeamMembersForHome();
        setTeamMembers(response.result || []);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-red-800">
          Meet Our Team
        </h1>
        <p className="mt-2 text-center text-red-800">
          Experienced professionals dedicated to your success.
        </p>

        <div className="grid gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <LoadingComponent />
          ) : teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <article
                key={member._id}
                className="p-6 bg-white shadow-lg rounded-lg text-red-800 transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <Link to={`/ourteam/${member._id}`}>
                  <img
                    src={member.image || ""}
                    alt={member.name}
                    className="w-40 h-40 max-w-full max-h-48 object-cover rounded-full mx-auto border-4 border-red-800 shadow-md"
                    style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/160x160/cccccc/000000?text=No+Image";
                    }}
                  />
                </Link>

                <h2 className="mt-4 text-xl font-semibold">{member.name}</h2>
                <p className="text-gray-800">{member.role}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {member.expertise || member.bio}
                </p>

                <div className="flex justify-center gap-4 mt-4">
                  {member.facebook && (
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-800 hover:text-gray-700 transition text-2xl"
                      aria-label={`${member.name} Facebook`}
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
                      aria-label={`${member.name} Twitter`}
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
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-red-800 hover:text-gray-700 transition text-2xl"
                      aria-label={`Email ${member.name}`}
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="col-span-full p-8 text-center text-gray-600 dark:text-gray-400">
              No team members found at the moment.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          href="/contact"
          className="flex items-center justify-center gap-2 w-[200px] h-[45px] bg-red-800 hover:bg-red-600 transition-transform duration-300 hover:scale-105"
        >
          <span className="text-white">CONTACT US NOW!</span>
        </Button>
      </div>
    </section>
  );
};

export default OurTeamComponent;
