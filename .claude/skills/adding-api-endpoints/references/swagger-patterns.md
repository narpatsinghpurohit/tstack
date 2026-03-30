# Swagger/OpenAPI Decorator Patterns

## Common controller decorators

```typescript
@ApiTags('users')                              // Group endpoints
@ApiBearerAuth()                               // Require JWT
@Controller('users')
export class UserController {

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() dto: CreateUserDto) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findById(@Param('id') id: string) {}
}
```

## Response types with Zod + nestjs-zod

When using `nestjs-zod`, Swagger schemas auto-generate from Zod definitions. The CLI plugin in `nest-cli.json` further reduces decorator needs by inferring from TypeScript types.

## nest-cli.json plugin config

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "introspectComments": true,
          "classValidatorShim": false
        }
      }
    ]
  }
}
```
