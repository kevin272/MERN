
class BaseService {
    skip = 0;
    limit = 10;
    setPagination=({page=1})=>{
        this.skip = (page - 1) * this.limit;
    }
}
