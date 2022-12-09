import { GetId } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from '@personalsModule/models/messages.model';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message) private messagesRepo: typeof Message) {}

  public create(personal_id: string, message: string) {
    this.messagesRepo.create({ message, personal_id, id: GetId() });
  }

  public get(personal_id: string): Promise<Message[]> {
    return this.messagesRepo.findAll({ where: { personal_id } });
  }
}
