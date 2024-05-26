import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User } from '../models/user.schema';
import { Movie } from '../models/movie.schema';
import { TVShow } from '../models/tvshow.schema';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;
  let movieModel: Model<Movie>;
  let tvShowModel: Model<TVShow>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockModel() },
        { provide: getModelToken(Movie.name), useValue: mockModel() },
        { provide: getModelToken(TVShow.name), useValue: mockModel() },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    movieModel = module.get<Model<Movie>>(getModelToken(Movie.name));
    tvShowModel = module.get<Model<TVShow>>(getModelToken(TVShow.name));
  });

  function mockModel() {
    return {
      findById: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
      save: jest.fn(),
    };
  }

  describe('addToList', () => {
    it('should add a movie to the user list', async () => {
      const userId = 'user1';
      const contentId = 'movie1';
      const contentType = 'Movie';

      const user = {
        _id: userId,
        myList: [],
        save: jest.fn().mockResolvedValue(true),
      };

      userModel.findById = jest.fn().mockResolvedValue(user);
      movieModel.findById = jest.fn().mockResolvedValue({ _id: contentId });

      const result = await service.addToList(userId, contentId, contentType);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(movieModel.findById).toHaveBeenCalledWith(contentId);
      expect(user.myList).toContainEqual({ contentId, contentType });
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      userModel.findById = jest.fn().mockResolvedValue(null);

      await expect(
        service.addToList('invalidUserId', 'contentId', 'Movie'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if content is not found', async () => {
      const user = {
        _id: 'user1',
        myList: [],
        save: jest.fn(),
      };

      userModel.findById = jest.fn().mockResolvedValue(user);
      movieModel.findById = jest.fn().mockResolvedValue(null);

      await expect(
        service.addToList('user1', 'invalidContentId', 'Movie'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromList', () => {
    it('should remove a content from the user list', async () => {
      const userId = 'user1';
      const contentId = 'content1';

      const user = {
        _id: userId,
        myList: [{ contentId, contentType: 'Movie' }],
        save: jest.fn().mockResolvedValue(true),
      };

      userModel.findById = jest.fn().mockResolvedValue(user);

      const result = await service.removeFromList(userId, contentId);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(user.myList).toEqual([]);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      userModel.findById = jest.fn().mockResolvedValue(null);

      await expect(
        service.removeFromList('invalidUserId', 'contentId'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not modify the list if content is not in the user list', async () => {
      const userId = 'user1';
      const contentId = 'content1';

      const user = {
        _id: userId,
        myList: [{ contentId: 'otherContent', contentType: 'Movie' }],
        save: jest.fn().mockResolvedValue(true),
      };

      userModel.findById = jest.fn().mockResolvedValue(user);

      const result = await service.removeFromList(userId, contentId);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(user.myList).toEqual([
        { contentId: 'otherContent', contentType: 'Movie' },
      ]);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('listMyItems', () => {
    it('should return paginated items from the user list', async () => {
      const userId = 'user1';
      const page = 1;
      const limit = 2;

      const user = {
        _id: userId,
        myList: [
          { contentId: 'content1', contentType: 'Movie' },
          { contentId: 'content2', contentType: 'TVShow' },
          { contentId: 'content3', contentType: 'Movie' },
        ],
      };

      userModel.findById = jest.fn().mockResolvedValue(user);

      const result = await service.listMyItems(userId, page, limit);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        totalItems: 3,
        items: [
          { contentId: 'content1', contentType: 'Movie' },
          { contentId: 'content2', contentType: 'TVShow' },
        ],
        currentPage: page,
        totalPages: 2,
      });
    });

    it('should throw an error if user is not found', async () => {
      userModel.findById = jest.fn().mockResolvedValue(null);

      await expect(service.listMyItems('invalidUserId', 1, 2)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return empty list if user has no items', async () => {
      const userId = 'user1';
      const page = 1;
      const limit = 2;

      const user = {
        _id: userId,
        myList: [],
      };

      userModel.findById = jest.fn().mockResolvedValue(user);

      const result = await service.listMyItems(userId, page, limit);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        totalItems: 0,
        items: [],
        currentPage: page,
        totalPages: 0,
      });
    });
  });

  describe('listUsers', () => {
    it('should return paginated list of users', async () => {
      const page = 1;
      const perPage = 2;

      const totalUsers = 3;
      const users = [
        { _id: 'user1', name: 'User One' },
        { _id: 'user2', name: 'User Two' },
      ];

      userModel.countDocuments = jest.fn().mockResolvedValue(totalUsers);
      userModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.listUsers(page, perPage);

      expect(userModel.countDocuments).toHaveBeenCalled();
      expect(userModel.find().skip).toHaveBeenCalledWith((page - 1) * perPage);
      expect(userModel.find().limit).toHaveBeenCalledWith(perPage);
      expect(userModel.find().exec).toHaveBeenCalled();
      expect(result).toEqual({ total: totalUsers, page, perPage, data: users });
    });

    it('should return empty list if no users found', async () => {
      const page = 1;
      const perPage = 2;

      const totalUsers = 0;
      const users = [];

      userModel.countDocuments = jest.fn().mockResolvedValue(totalUsers);
      userModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.listUsers(page, perPage);

      expect(userModel.countDocuments).toHaveBeenCalled();
      expect(userModel.find().skip).toHaveBeenCalledWith((page - 1) * perPage);
      expect(userModel.find().limit).toHaveBeenCalledWith(perPage);
      expect(userModel.find().exec).toHaveBeenCalled();
      expect(result).toEqual({ total: totalUsers, page, perPage, data: users });
    });
  });
});
