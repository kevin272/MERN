import { Badge, Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { HeadingWithLink } from "../../components/common/title";
import { useCallback, useEffect, useState } from "react";
import RowSkeleton from "../../components/common/table/table-skeleton.component";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import BlogsSvc from "./blogs.service";
import { SearchParams } from "../../config/constants";
import { ActionButtons } from "../../components/table/table-action.component";
const Blogslistingpage = () => {
  let [pagination, setpagination] = useState({
    currentPage: 1,
    totalpages: 100,
  });

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setsearch] = useState<string | null>()

  const onPageChange = useCallback(async(page: number) => {
    
    setpagination({
      ...pagination,
      currentPage: page,
    });
    await getallBlogs({
      page:1,
      limit:5,
      search,
    })
  },[search])

  const getallBlogs = useCallback( async ({page=1, limit=5, search=''}: SearchParams) => {
    setLoading(true);
    try {
      
      const response: any = await BlogsSvc.getRequest("/blogs", {auth:true , params:{limit:limit, page: page, search: search}})
      
      setBlogs(response.data)
      
      setpagination({
        currentPage:response.meta.currentPage,
        totalpages: Math.ceil(response.meta.totalPages/ response.meta.limit)

      })
    } catch (exception) {
      console.log(exception);
      toast.error("error while fetching blogs lists")
    } finally {
      setLoading(false);
    }
  }, [pagination])

  useEffect(() => {
    getallBlogs({
      page: 1,
      limit: 5
    });
  }, []);

  useEffect(()=> {
    const timeout = setTimeout(() => {
      getallBlogs({
        page:1,
        limit:5,
        search:search
      })
    }, 1000);
    return ()=>{
      clearTimeout(timeout);
    }
  },[search])

  const deleteData = async (id:string)=>{
      try{
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
          // API call to delete the request
         await BlogsSvc.deleteRequest("/blogs/"+id, {auth:true});
         toast.success("Blog deleted successfully");
         getallBlogs({
          page:1,
          limit:5}
         )
        }
      }catch(exception){
          console.log(exception);
          toast.error("Blog cannot be deleted at this moment");
      }
  }

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <HeadingWithLink
          title="Blogs Management"
          link="/admin/blogs/create"
          btntxt="Add Blogs"
        />
        <br />
        <hr />
      </div>

      <div className="flex items-end justify-end mb-3">
      <TextInput className="w-1/4 " type="search" onChange={(e:any ) =>{
        setsearch(e.target.value)
      }}/>
      </div>

      <div className="overflow-x-auto">
        
        <Table>
          <Table.Head>
            <Table.HeadCell className="bg-red-800 text-white">
              Blog Name
            </Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">
              Author Name
            </Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">
              Image
            </Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">
              Status
            </Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">
              Action
              
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? (
              <>
                <RowSkeleton rows={5} cols={5} />
              </>
            ) : (
              <>
                {blogs && blogs.length > 0 ? (
                  <>
                    {blogs.map((row: any, index: number) => (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {row.title}
                          
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {row.Authorname}
                        </Table.Cell>
                        <Table.Cell>
                          <img src={row.image} className=" w-24 "/>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color={row.status ==="active"? "green" : "red"}>
                            {row.status ==="active" ? "Publish" : "Unpublish"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell className="flex gap-3">
                          <ActionButtons
                          editUrl={`/admin/blogs/edit/${row._id}`}
                          deleteAction={deleteData}
                          rowId={row._id}/>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </>
                ) : (
                  <>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell
                        colSpan={5}
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center"
                      >
                        No Data Found
                      </Table.Cell>
                    </Table.Row>
                  </>
                )}
              </>
            )}

            {/*  */}
          </Table.Body>
        </Table>

        {/*pagination*/}
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

export default Blogslistingpage;
