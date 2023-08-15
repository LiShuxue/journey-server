import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  port: 4000,
}));
