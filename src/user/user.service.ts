import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.schema';
import { Movie } from '../models/movie.schema';
import { TVShow } from '../models/tvshow.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
  ) {}

  async addToList(
    userId: string,
    contentId: string,
    contentType: string,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isExist = user.myList.find(
      (item) =>
        item.contentId === contentId && item.contentType === contentType,
    );
    if (isExist) {
      return user;
    }

    if (contentType === 'Movie') {
      const movie = await this.movieModel.findById(contentId);
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }
    } else if (contentType === 'TVShow') {
      const tvShow = await this.tvShowModel.findById(contentId);
      if (!tvShow) {
        throw new NotFoundException('TV Show not found');
      }
    } else {
      throw new NotFoundException('Invalid content type');
    }

    user.myList.push({ contentId, contentType });
    await user.save();
    return user;
  }

  async removeFromList(userId: string, contentId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('contentId', contentId);
    console.log('user', user);
    user.myList = user.myList.filter((item) => item.contentId !== contentId);
    await user.save();
    return user;
  }

  async listMyItems(userId: string, page: number, limit: number): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const items = user.myList.slice(startIndex, endIndex);

    return {
      totalItems: user.myList.length,
      items,
      currentPage: page,
      totalPages: Math.ceil(user.myList.length / limit),
    };
  }
  async listUsers(page: number, perPage: number): Promise<any> {
    const totalUsers = await this.userModel.countDocuments();
    const users = await this.userModel
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return { total: totalUsers, page, perPage, data: users };
  }
}
