import { z } from 'zod';

// @NOTE: got the numbers from here [https://learn.microsoft.com/en-us/previous-versions/mappoint/aa578799(v=msdn.10)?redirectedfrom=MSDN]
const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type TCoordinates = z.infer<typeof coordinatesSchema>;

export { coordinatesSchema, TCoordinates };
