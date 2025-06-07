import { Pagination, TextInput, Badge, Table } from "flowbite-react";
import { HeadingWithLink } from "../../components/common/title";
import { useCallback, useEffect, useState } from "react";
import LoadingComponent from "../../components/common/loading/loading.component";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CampaignSvc from "./campaigns.service";
import { SearchParams } from "../../config/constants";
import { ActionButtons } from "../../components/table/table-action.component";
import RowSkeleton from "../../components/common/table/table-skeleton.component";

const Campaignlistingpage = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalpages: 1,
  });

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>('');

  const getallCampaign = useCallback(async ({ page = 1, limit = 5, search = '' }: SearchParams) => {
    setLoading(true);
    try {
      const response: any = await CampaignSvc.getCampaigns({ page, limit, search });
      setCampaigns(response.result || []);
      if (response.meta) {
        setPagination({
          currentPage: response.meta.page,
          totalpages: Math.ceil(response.meta.total / response.meta.limit)
        });
      } else {
        setPagination({ currentPage: page, totalpages: 1 });
      }
    } catch (exception) {
      toast.error("Error while fetching Campaign lists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getallCampaign({ page: 1, limit: 5, search: '' });
  }, [getallCampaign]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getallCampaign({ page: 1, limit: 5, search: search });
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [search, getallCampaign]);

  const onPageChange = useCallback(async (page: number) => {
    await getallCampaign({ page: page, limit: 5, search: search });
  }, [getallCampaign, search]);

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
        await CampaignSvc.deleteCampaign(id);
        toast.success("Campaign deleted successfully");
        getallCampaign({
          page: pagination.currentPage,
          limit: 5,
          search: search
        });
      }
    } catch (exception) {
      console.error("Campaign deletion error:", exception);
      toast.error("Campaign cannot be deleted at this moment");
    }
  }

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <HeadingWithLink
          title="Campaign Management"
          link="/admin/campaign/create"
          btntxt="Add Campaign"
        />
        <br />
        <hr />
      </div>

      <div className="flex items-end justify-left mb-3">
        <TextInput
          className="w-1/4"
          type="search"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          value={search || ''}
          placeholder="Search campaigns..."
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell className="bg-emerald-800 text-white"> 
              Title
            </Table.HeadCell>
            <Table.HeadCell className="bg-emerald-800 text-white"> 
              Description
            </Table.HeadCell>
            <Table.HeadCell className="bg-emerald-800 text-white"> 
              Status
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
                {campaigns && campaigns.length > 0 ? (
                  campaigns.map((row: any) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={row._id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {row.title}
                      </Table.Cell>
                      <Table.Cell>{row.description}</Table.Cell>
                      <Table.Cell>
                        <Badge color={row.status === "active" ? "green" : "red"}>
                          {row.status === "active" ? "Published" : "Unpublished"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="flex gap-3">
                        <ActionButtons
                          editUrl={`/admin/campaign/edit/${row._id}`}
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

export default Campaignlistingpage;