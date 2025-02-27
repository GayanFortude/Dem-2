import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class PaginationObject {
    @Field()
    total: number;
    @Field()
    page: number;
    @Field()
    limit: number;
}