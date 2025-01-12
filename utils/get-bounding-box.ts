import { Locator } from "@playwright/test";

export const getBoundingBox = async (locator: Locator) => {
  const handle = await locator.elementHandle();
  const box = (await handle?.boundingBox()) ?? {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  await handle?.dispose();

  return {
    ...box,
    topLeft: [box.x, box.y],
    topRight: [box.x + box.width, box.y],
    bottomLeft: [box.x, box.y + box.height],
    bottomRight: [box.x + box.width, box.y + box.height],
  };
};
