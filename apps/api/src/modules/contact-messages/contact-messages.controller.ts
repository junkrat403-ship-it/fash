import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactMessagesController {
  constructor(private readonly contactService: ContactMessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit contact form message' })
  @ApiResponse({ status: 201, description: 'Message received successfully' })
  async create(@Body() dto: CreateContactDto) {
    const message = await this.contactService.create(dto);
    return {
      success: true,
      message: 'Thank you for reaching out! We will get back to you shortly.',
      id: message.id,
    };
  }
}
