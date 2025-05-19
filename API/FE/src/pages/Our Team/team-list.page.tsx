import { Badge, Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { HeadingWithLink } from "../../components/common/title";
import { useCallback, useEffect, useState } from "react";
import RowSkeleton from "../../components/common/table/table-skeleton.component";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import TeamSvc from "./team.service";
import { SearchParams } from "../../config/constants";
import { ActionButtons } from "../../components/table/table-action.component";

const TeamListingPage = () => {
  let [pagination, setPagination] = useState({
    currentPage: 1,
    totalpages: 100,
  });

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setsearch] = useState<string | null>();

  const onPageChange = useCallback(async (page: number) => {
    setPagination({
      ...pagination,
      currentPage: page,
    });

    await getAllTeams({
      page: 1,
      limit: 5,
      search,
    });
  }, [search]);

  const getAllTeams = useCallback(async ({ page = 1, limit = 5, search = "" }: SearchParams) => {
    setLoading(true);
    try {
      const response: any = await TeamSvc.getRequest("/member", {
        auth: true,
        params: { limit:limit, page:page, search:search },
      });

      setTeams(response.data);
      setPagination({
        currentPage: response.meta.currentPage,
        totalpages: Math.ceil(response.meta.totalPages / response.meta.limit),
      });
    } catch (exception) {
      console.log(exception);
      toast.error("Error while fetching team list");
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    getAllTeams({ page: 1, limit: 5 });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllTeams({ page: 1, limit: 5, search });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  const deleteData = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });


      if (result.isConfirmed) {
        await TeamSvc.deleteRequest("/member/"+id, { auth: true });
        toast.success("Team member deleted successfully");
        getAllTeams({ page: 1, limit: 5 });
      }
    } catch (exception) {
      console.log(exception);
      toast.error("Error while deleting team member");
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <HeadingWithLink
          title="Team Management"
          link="/admin/teammembers/create"
          btntxt="Add Member"
        />
        <br />
        <hr />
      </div>

      <div className="flex items-end justify-end mb-3">
        <TextInput
          className="w-1/4"
          type="search"
          onChange={(e: any) => setsearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell className="bg-red-800 text-white">
              Full Name
            </Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">
              Email
            </Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">
              Role
            </Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">
              Action
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? (
              <RowSkeleton rows={5} cols={4} />
            ) : (
              <>
                {teams && teams.length > 0 ? (
                  <>
                    {teams.map((row: any, index: number) => (
                      <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={index}
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {row.fullname}
                        </Table.Cell>
                        <Table.Cell>{row.email} </Table.Cell>
                        <Table.Cell>
                          <Badge color={row.role === "admin" ? "green" : "blue"}>
                            {row.role}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell className="flex gap-3">
                          <ActionButtons
                            editUrl={`/admin/teammembers/edit/${row._id}`}
                            deleteAction={deleteData}
                            rowId={row._id}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </>
                ) : (
                  <>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell
                        colSpan={4}
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center"
                      >
                        No Data Found
                      </Table.Cell>
                    </Table.Row>
                  </>
                )}
              </>
            )}
          </Table.Body>
        </Table>

        {/* Pagination */}
        <div className="flex overflow-x-auto sm:justify-end">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalpages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};

export default TeamListingPage;
