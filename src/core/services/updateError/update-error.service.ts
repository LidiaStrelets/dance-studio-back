import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UpdateErrorService {
  public throwError(updatedNumber: number): void {
    if (updatedNumber !== 1) {
      throw new HttpException(
        [
          {
            message: [
              'Requested item not found or duplicated - check the item id',
            ],
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
