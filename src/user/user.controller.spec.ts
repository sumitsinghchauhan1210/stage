import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            addToList: jest.fn(),
            removeFromList: jest.fn(),
            listMyItems: jest.fn(),
            listUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('addToList', () => {
    it('should add content to user list', async () => {
      const userId = 'user1';
      const contentId = 'content1';
      const contentType = 'Movie';
      const user = { _id: userId, myList: [{ contentId, contentType }] };

      (service.addToList as jest.Mock).mockResolvedValue(user);

      const result = await controller.addToList(userId, contentId, contentType);

      expect(service.addToList).toHaveBeenCalledWith(
        userId,
        contentId,
        contentType,
      );
      expect(result).toEqual(user);
    });

    it('should throw an error if service throws', async () => {
      (service.addToList as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.addToList('user1', 'content1', 'Movie'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromList', () => {
    it('should remove content from user list', async () => {
      const userId = 'user1';
      const contentId = 'content1';
      const user = { _id: userId, myList: [] };

      (service.removeFromList as jest.Mock).mockResolvedValue(user);

      const result = await controller.removeFromList(userId, contentId);

      expect(service.removeFromList).toHaveBeenCalledWith(userId, contentId);
      expect(result).toEqual(user);
    });

    it('should throw an error if service throws', async () => {
      (service.removeFromList as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.removeFromList('user1', 'content1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listMyItems', () => {
    it('should return paginated items from user list', async () => {
      const userId = 'user1';
      const page = 1;
      const limit = 10;
      const response = {
        totalItems: 1,
        items: [{ contentId: 'content1', contentType: 'Movie' }],
        currentPage: page,
        totalPages: 1,
      };

      (service.listMyItems as jest.Mock).mockResolvedValue(response);

      const result = await controller.listMyItems(userId, page, limit);

      expect(service.listMyItems).toHaveBeenCalledWith(userId, page, limit);
      expect(result).toEqual(response);
    });

    it('should throw an error if service throws', async () => {
      (service.listMyItems as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.listMyItems('user1', 1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('listUsers', () => {
    it('should return paginated list of users', async () => {
      const page = 1;
      const limit = 10;
      const response = {
        total: 1,
        page,
        perPage: limit,
        data: [{ _id: 'user1', name: 'User One' }],
      };

      (service.listUsers as jest.Mock).mockResolvedValue(response);

      const result = await controller.listUsers(page, limit);

      expect(service.listUsers).toHaveBeenCalledWith(page, limit);
      expect(result).toEqual(response);
    });

    it('should throw an error if service throws', async () => {
      (service.listUsers as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.listUsers(1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
