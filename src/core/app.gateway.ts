import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IPersonalResponce } from '@personalsModule/types/types';
import { SocketEvents } from './types';
import { PersonalsService } from '@personalsModule/services/personals.service';

@WebSocketGateway(8080, {
  cors: { origin: process.env.IMAGES_BASE_URL, methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server;

  private logger = new Logger('AppGateway');

  constructor(private personalService: PersonalsService) {}

  @SubscribeMessage(SocketEvents.newPersonal)
  async handleNewPersonal(client: Socket, data: IPersonalResponce) {
    this.logger.log('new personal', client, data);
    const [mapped] = await this.personalService.mapPersonalToResponce([data]);

    this.server.emit(SocketEvents.personalCreated, mapped);
  }

  @SubscribeMessage(SocketEvents.newMessage)
  handleNewMessage(client: Socket, data: IPersonalResponce) {
    this.logger.log('new message', client, data);

    this.server.emit(SocketEvents.messageCreated, data);
  }

  afterInit(server: Server) {
    this.logger.log('init socket server');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Disonnected ${client.id}`);
  }
}
