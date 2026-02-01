import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { UploadModule } from '@/shared/upload/upload.module';
import { MediaController } from './media.controller';

@Module({
  imports: [UploadModule],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule { }
