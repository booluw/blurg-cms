import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Server health, time and version"', () => {
      expect(appController.getHello()).resolves.toStrictEqual({
        status: 'Blurg is healthy',
        time: `${new Date().getFullYear()} ${new Date().getMonth()} ${new Date().getDay()}`,
        version: 'v1',
      });
    });
  });
});
