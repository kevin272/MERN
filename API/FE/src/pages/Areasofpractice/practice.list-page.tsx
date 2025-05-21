import {  Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { HeadingWithLink } from "../../components/common/title";
import { useCallback, useEffect, useState } from "react";
import RowSkeleton from "../../components/common/table/table-skeleton.component";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PracticeSvc from "./practice.service"; // Assuming you have a similar service for practice
import { SearchParams } from "../../config/constants";
import { ActionButtons } from "../../components/table/table-action.component";

const PracticeListingPage = () => {
  let [pagination, setpagination] = useState({
    currentPage: 1,
    totalpages: 100,
  });

  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setsearch] = useState<string | null>();

  const onPageChange = useCallback(async (page: number) => {
    setpagination({
      ...pagination,
      currentPage: page,
    });
    await getAllPractices({
      page: 1,
      limit: 5
    });
  }, [search]);

  const getAllPractices = useCallback(async ({ page = 1, limit = 5, search = '' }: SearchParams) => {
    setLoading(true);
    try {
      const response: any = await PracticeSvc.getRequest("/practice", { auth: true, params: { limit: limit, page: page, search: search } });
      setPractices(response.data);
      setpagination({
        currentPage: response.meta.currentPage,
        totalpages: Math.ceil(response.meta.totalPages / response.meta.limit)
      });
    } catch (exception) {
      console.log(exception);
      toast.error("Error while fetching practice lists");
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    getAllPractices({
      page: 1,
      limit: 5,
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllPractices({
        page: 1,
        limit: 5,
        search: search
      });
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
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
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        await PracticeSvc.deleteRequest("/practice/" + id, { auth: true });
        toast.success("Practice deleted successfully");
        getAllPractices({
          page: 1,
          limit: 5
        });
      }
    } catch (exception) {
      console.log(exception);
      toast.error("Practice cannot be deleted at this moment");
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <HeadingWithLink
          title="Areas of Practice Management"
          link="/admin/areasofpractice/create"
          btntxt="Add Practice"
        />
        <br />
        <hr />
      </div>

      <div className="flex items-end justify-end mb-3">
        <TextInput className="w-1/4" type="search" onChange={(e: any) => {
          setsearch(e.target.value);
        }} />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell className="bg-red-800 text-white">Practice Name</Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">Image</Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">Action</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {loading ? (
              <RowSkeleton rows={5} cols={5} />
            ) : (
              <>
                {practices && practices.length > 0 ? (
                  practices.map((row: any, index: number) => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {row.title}
                      </Table.Cell>
                     
                      <Table.Cell>
                        <img src={row.image} className="w-24" />
                      </Table.Cell>
                      
                      <Table.Cell className="flex gap-3">
                        <ActionButtons
                          editUrl={`/admin/areasofpractice/edit/${row._id}`}
                          deleteAction={deleteData}
                          rowId={row._id}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell
                      colSpan={5}
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

export default PracticeListingPage;
