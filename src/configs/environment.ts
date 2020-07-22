// libraries
import { env } from "../lib/environment";

export default {
  name: 'social-media-hub-api',
  options: {
    example: './env.example',
    path: './env',
    ssm: env.isLocal,
  },
}