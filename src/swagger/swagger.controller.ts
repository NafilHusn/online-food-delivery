import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { createReadStream } from 'fs';
import type { Response } from 'express';

@Controller('swagger-assets')
export class SwaggerCustomController {
  @Get('custom.js')
  getSwaggerTokenScript(@Res() res: Response) {
    const filePath = join(
      process.cwd(),
      'utils',
      'swagger',
      'swagger-token.js',
    );

    res.setHeader('Content-Type', 'application/javascript');
    const stream = createReadStream(filePath);
    stream.pipe(res);
  }
}
