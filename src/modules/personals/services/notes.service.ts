import { GetId } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateNotesDto } from '@personalsModule/dto/create-notes.dto';
import { Notes } from '@personalsModule/models/notes.model';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes) private notesRepo: typeof Notes) {}

  public create(dto: CreateNotesDto): Promise<Notes> {
    return this.notesRepo.create({ ...dto, id: GetId() });
  }

  public update(
    dto: CreateNotesDto,
    id: string,
  ): Promise<[affectedCount: number, affectedRows: Notes[]]> {
    return this.notesRepo.update(dto, { where: { id }, returning: true });
  }

  public get(class_id: string): Promise<Notes> {
    return this.notesRepo.findOne({ where: { class_id } });
  }
}
