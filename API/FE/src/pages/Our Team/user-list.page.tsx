import { Badge, Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { HeadingWithLink } from "../../components/common/title";
import { useCallback, useEffect, useState } from "react";
import RowSkeleton from "../../components/common/table/table-skeleton.component";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import UserSvc from "./user.service";
import { SearchParams } from "../../config/constants";
import { ActionButtons } from "../../components/table/table-action.component";

const UserListingPage = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalpages: 1,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>('');

  const getAllUsers = useCallback(async ({ page = 1, limit = 5, search = "" }: SearchParams) => {
    setLoading(true);
    try {
      const response: any = await UserSvc.getUsers({ page, limit, search });
      setUsers(response.result || []);
      setPagination({
        currentPage: response.meta.page,
        totalpages: Math.ceil(response.meta.total / response.meta.limit),
      });
    } catch (exception) {
      console.error("Error fetching user list:", exception);
      toast.error("Error fetching user list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllUsers({ page: 1, limit: 5 });
  }, [getAllUsers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllUsers({ page: 1, limit: 5, search });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, getAllUsers]);

  const onPageChange = useCallback(async (page: number) => {
    await getAllUsers({
      page: page,
      limit: 5,
      search: search,
    });
  }, [getAllUsers, search]);

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
        await UserSvc.deleteUser(id);
        toast.success("User (Team member) deleted successfully");
        getAllUsers({ page: pagination.currentPage, limit: 5, search: search });
      }
    } catch (exception) {
      console.error("Error deleting user:", exception);
      toast.error("Error deleting user");
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <HeadingWithLink
          title="Team Management"
          link="/admin/users/create"
          btntxt="Add User"
        />
        <br />
        <hr />
      </div>

      <div className="flex items-end justify-end mb-3">
        <TextInput
          className="w-1/4"
          type="search"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          value={search || ''}
          placeholder="Search users..."
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell className="bg-emerald-800 text-white">
              Full Name
            </Table.HeadCell>
            <Table.HeadCell className="bg-emerald-800 text-white">
              Email
            </Table.HeadCell>
            <Table.HeadCell className="bg-emerald-800 text-white">
              Role
            </Table.HeadCell>
            <Table.HeadCell className="bg-emerald-800 text-white">
              Actions
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? (
              <RowSkeleton rows={5} cols={4} />
            ) : (
              <>
                {users && users.length > 0 ? (
                  users.map((row: any) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={row._id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {row.name}
                      </Table.Cell>
                      <Table.Cell>{row.email}</Table.Cell>
                      <Table.Cell>
                        <Badge color={row.role === "admin" ? "green" : "red"}>
                          {row.role}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="flex gap-3">
                        <ActionButtons
                          editUrl={`/admin/users/edit/${row._id}`}
                          deleteAction={deleteData}
                          rowId={row._id}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell
                      colSpan={4}
                      className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center"
                    >
                      No Data Found
                    </Table.Cell>
                  </Table.Row>
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

export default UserListingPage;