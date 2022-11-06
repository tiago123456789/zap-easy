import { ResponsePaginatedDto } from "../dtos/response-paginated.dto";
import { Repository } from "typeorm";

export abstract class UtilRepository<T> {

    protected repository: Repository<T>;

    async findAllPaginate(
        page: number | undefined, 
        itemsPerPage: number | undefined): Promise<ResponsePaginatedDto<T>> {
        const skip = ( page - 1) * itemsPerPage;
        page = page || 1;
        itemsPerPage = itemsPerPage || 10;
        const registers = await this.repository.findAndCount({
            take: itemsPerPage,
            skip: skip
        });

        const data = registers[0]
        const total = registers[1]

        return new ResponsePaginatedDto(
            data, page, itemsPerPage, total
        )
    }
}
