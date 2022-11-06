
export class ResponsePaginatedDto<T> {

    data: Array<T>;

    page: number;

    totalItensPerPage: number;

    totalItems: number

    constructor(data: Array<T>, page: number, totalItensPerPage: number, totalItems: number) {
        this.data = data;
        this.page = page;
        this.totalItems = totalItems;
        this.totalItensPerPage = totalItensPerPage;
    }

}