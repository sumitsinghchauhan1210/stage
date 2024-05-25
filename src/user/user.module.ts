import { Module } from '@nestjs/common';
import { User, UserSchema } from '../models/user.schema';
import { Movie, MovieSchema } from '../models/movie.schema';
import { TVShow, TVShowSchema } from '../models/tvshow.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MongooseModule.forFeature([{ name: TVShow.name, schema: TVShowSchema }]),
  ],
  exports: [MongooseModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
