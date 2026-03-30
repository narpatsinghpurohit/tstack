> *Code examples reference `@tstack/shared`. Replace with your project's shared package from CLAUDE.md.*

# Example: NestJS Service Unit Test (Real Codebase)

## ChapterService spec — `chapter.service.spec.ts`

```typescript
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { getConnectionToken } from "@nestjs/mongoose";
import { Test, type TestingModule } from "@nestjs/testing";
import type { CreateChapterDto } from "@tstack/shared";
import { SubjectRepository } from "../subject/subject.repository";
import { ChapterRepository } from "./chapter.repository";
import { ChapterService } from "./chapter.service";

const ORG_ID = "org-1";
const SUBJECT_ID = "507f1f77bcf86cd799439011";
const CHAPTER_ID_1 = "507f1f77bcf86cd799439013";

describe("ChapterService", () => {
  let service: ChapterService;
  let moduleRef: TestingModule;

  // Manual mocks — no real DB needed
  const chapterRepository = {
    createChapter: jest.fn(),
    deleteOneByOrg: jest.fn(),
    findOneByOrg: jest.fn(),
    findLastBySubject: jest.fn(),
  };
  const subjectRepository = {
    findOneByOrg: jest.fn(),
  };

  const createDto: CreateChapterDto = {
    subjectId: SUBJECT_ID,
    title: "Linear equations",
  };

  const buildChapter = (id: string, order: number, overrides = {}) => ({
    _id: id,
    orgId: ORG_ID,
    subjectId: SUBJECT_ID,
    title: `Chapter ${order}`,
    contentMarkdown: "",
    order,
    ...overrides,
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ChapterService,
        { provide: ChapterRepository, useValue: {} },
        { provide: SubjectRepository, useValue: {} },
        { provide: getConnectionToken(), useValue: {} },
      ],
    })
      .overrideProvider(ChapterRepository)
      .useValue(chapterRepository)
      .overrideProvider(SubjectRepository)
      .useValue(subjectRepository)
      .compile();

    service = moduleRef.get(ChapterService);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe("create", () => {
    it("should assign order 0 when creating the first chapter", async () => {
      subjectRepository.findOneByOrg.mockResolvedValue({ _id: SUBJECT_ID });
      chapterRepository.findLastBySubject.mockResolvedValue(null);
      chapterRepository.createChapter.mockResolvedValue(
        buildChapter(CHAPTER_ID_1, 0, { title: createDto.title }),
      );

      const result = await service.create(ORG_ID, createDto);

      expect(subjectRepository.findOneByOrg).toHaveBeenCalledWith(
        ORG_ID,
        { _id: SUBJECT_ID },
      );
      expect(result).toEqual(
        buildChapter(CHAPTER_ID_1, 0, { title: createDto.title }),
      );
    });
  });

  describe("delete", () => {
    it("should throw when chapter not found", async () => {
      chapterRepository.deleteOneByOrg.mockResolvedValue(null);

      await expect(service.delete(ORG_ID, CHAPTER_ID_1)).rejects.toThrow(
        new NotFoundException("Chapter not found"),
      );
    });
  });
});
```

## Key patterns

1. **`Test.createTestingModule`** — NestJS testing module, not raw Jest
2. **Manual mock objects** — plain objects with `jest.fn()` methods, no `jest.mock()`
3. **`overrideProvider().useValue()`** — inject mocks into DI container
4. **`jest.clearAllMocks()`** in `beforeEach` — clean state per test
5. **`moduleRef.close()`** in `afterEach` — prevent memory leaks
6. **Builder helpers** like `buildChapter()` — reduce test boilerplate
7. **Test NestJS exceptions** — `rejects.toThrow(new NotFoundException(...))`
8. **`orgId` always passed** — test multi-tenant scoping
