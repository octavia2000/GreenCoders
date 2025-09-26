import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';
import * as SYS_MSG from '../../helpers/SystemMessages';

export class GoogleAuthPayloadDto {
  @ApiProperty({
    description: 'Google ID token from client for OAuth authentication',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    minLength: 100,
    pattern: '^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$'
  })
  @IsString({ message: 'Google ID token must be a string' })
  @IsNotEmpty({ message: 'Google ID token is required' })
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, {
    message: 'Google ID token must be a valid JWT format'
  })
  id_token: string;
}