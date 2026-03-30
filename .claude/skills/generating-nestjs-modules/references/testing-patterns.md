# NestJS Module Testing Patterns

## Unit test template for service

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ExampleService } from '../example.service';
import { ExampleRepository } from '../example.repository';

describe('ExampleService', () => {
  let service: ExampleService;
  let repository: jest.Mocked<ExampleRepository>;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleService,
        { provide: ExampleRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
    repository = module.get(ExampleRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return entity', async () => {
      const dto = { name: 'Test' };
      const expected = { _id: '1', ...dto };
      mockRepository.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(result).toEqual(expected);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById', () => {
    it('should return entity when found', async () => {
      const expected = { _id: '1', name: 'Test' };
      mockRepository.findById.mockResolvedValue(expected);

      const result = await service.findById('1');

      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

## Unit test template for controller

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from '../example.controller';
import { ExampleService } from '../example.service';

describe('ExampleController', () => {
  let controller: ExampleController;
  let service: jest.Mocked<ExampleService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
      providers: [{ provide: ExampleService, useValue: mockService }],
    }).compile();

    controller = module.get<ExampleController>(ExampleController);
    service = module.get(ExampleService);
    jest.clearAllMocks();
  });

  it('should call service.create with dto', async () => {
    const dto = { name: 'Test' };
    mockService.create.mockResolvedValue({ _id: '1', ...dto });

    const result = await controller.create(dto);

    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result._id).toBeDefined();
  });
});
```
