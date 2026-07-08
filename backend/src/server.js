import app from './app.js';
import { env } from './utils/env.js';

app.listen(env.port, () => {
  console.log(`WeeklyPulse API running on port ${env.port}`);
});
