import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'Student', url: 'http://localhost:3001/graphql' },
            { name: 'Course', url: 'http://localhost:3004/graphql' },
          ],
        }),
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
