import { BlogsComponentforPage } from "../../components/blogs";
import Breadcrumbnavigation from "../../components/common/breadcrumb navigation/breadcrumb component";

const BlogPage = () =>{
    return(<>
    <Breadcrumbnavigation>Blogs</Breadcrumbnavigation>
    
    <BlogsComponentforPage/>
    
    </>)
}

export default BlogPage;