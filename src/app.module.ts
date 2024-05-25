import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sumitchauhan:sumit123@mymongocluster.8m4b817.mongodb.net/stage?retryWrites=true&w=majority&appName=MyMongoCluster',
    ),
    UserModule,
    MoviesModule,
    TvshowsModule,
  ],
})
export class AppModule {}
