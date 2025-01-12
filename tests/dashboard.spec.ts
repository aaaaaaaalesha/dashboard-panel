import { test, expect } from "@playwright/test";
import { getBoundingBox } from "../utils";
test.beforeEach(async ({ page }) => {
  await page.goto("", { waitUntil: "load" });
});

test.describe("basic layout and styles", () => {
  test("main has basic blocks", async ({ page }) => {
    const main = page.locator("#main");
    await expect(main).toBeVisible();

    const blocks = ["cards", "operations", "last-activity", "costs"];
    await Promise.all(
      blocks.map(async (block) => {
        const el = page.locator(`#main > #${block}`);
        await expect(el).toBeVisible();
      })
    );
  });

  test("body has color", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).toHaveCSS("background-color", "rgb(245, 247, 250)");
  });

  test("main has max-width", async ({ page }) => {
    const main = page.locator("#main");
    await expect(main).toHaveCSS("max-width", "1110px");
    const box = await getBoundingBox(main);
    expect(box.width).toBe(1110);
  });

  test("main has top spacing 32px", async ({ page }) => {
    const main = page.locator("#main");
    await expect(main).toBeVisible();

    const box = await getBoundingBox(main);
    expect(box.y).toBe(32);
  });

  test("main must be grid", async ({ page }) => {
    const main = page.locator("#main");
    await expect(main).toHaveCSS("display", "grid");
  });

  test("main must have correct gap", async ({ page }) => {
    const main = page.locator("#main");
    await expect(main).toHaveCSS("gap", "60px 30px");
  });

  test("main block must be centered", async ({ page }) => {
    const html = page.locator("html");
    const main = page.locator("#main");
    await expect(main).toBeVisible();

    const box = await getBoundingBox(main);
    const mainBox = await getBoundingBox(html);
    expect(box.x).toBe(mainBox.width - box.bottomRight[0]);
  });
});

test.describe("test cards", () => {
  test("should be grid with correct styles", async ({ page }) => {
    const cards = page.locator("#cards");
    await expect(cards).toHaveCSS("display", "grid");
    await expect(cards).toHaveCSS("grid-template-columns", "350px 350px");
  });

  test("should have header", async ({ page }) => {
    const header = page.locator("#cards > h1");
    await expect(header).toHaveText("Мои карты");
  });

  test("should have view all text", async ({ page }) => {
    const header = page.locator("#cards > h2");
    await expect(header).toHaveText("Посмотреть все");
  });

  test("cards should have correct gap", async ({ page }) => {
    const cards = page.locator("#cards");
    await expect(cards).toHaveCSS("gap", "20px 30px");
  });

  test("cards should be grid", async ({ page }) => {
    const cards = await page.locator(".card").all();
    for (const card of cards) {
      await expect(card).toHaveCSS("display", "grid");
    }
  });

  test("cards should have common styles", async ({ page }) => {
    const cards = await page.locator(".card").all();
    for (const card of cards) {
      await expect(card).toHaveCSS("border-radius", "25px");
      await expect(card).toHaveCSS("padding", "24px 26px");
    }
  });

  test("card number should spanned to all columns", async ({ page }) => {
    const cardsNumbers = await page.locator(".card .card-number").all();

    for (const cardNumber of cardsNumbers) {
      await expect(cardNumber).toHaveCSS("width", "298px");
    }
  });

  test.describe("test blue cards", () => {
    test("should have correct background-color", async ({ page }) => {
      const blueCard = page.locator(".card").first();
      await expect(blueCard).toHaveCSS("background-color", "rgb(76, 73, 237)");
    });

    test("should have correct color at balance", async ({ page }) => {
      const blueCard = page.locator(".card").first();
      const balance = blueCard.locator(".balance");
      const textElements = await balance.locator("*").all();
      for (const element of textElements) {
        await expect(element).toHaveCSS("color", "rgb(255, 255, 255)");
      }
    });

    test("should have correct color at card-text", async ({ page }) => {
      const blueCard = page.locator(".card").first();
      const cardTexts = await blueCard.locator(".card-text").all();
      for (const cardText of cardTexts) {
        // Реализовал через `opacity` в `.card-unit` -> `.card-key`.
        // const textBlockName = cardText.locator("*").first();
        // await expect(textBlockName).toHaveCSS(
        //   "color",
        //   "rgba(255, 255, 255, 0.7)"
        // );
        const textBlockValue = cardText.locator("*").last();
        await expect(textBlockValue).toHaveCSS("color", "rgb(255, 255, 255)");
      }
    });

    test("should have correct color for card number", async ({ page }) => {
      const blueCard = page.locator(".card").first();
      const cardNumber = blueCard.locator(".card-number");

      await expect(cardNumber).toHaveCSS("color", "rgb(255, 255, 255)");
    });

    test("should match screenshot", async ({ page }) => {
      const blueCard = page.locator(".card").first();
      await expect(blueCard).toHaveScreenshot();
    });
  });

  test.describe("test white card", () => {
    test("should have correct background-color", async ({ page }) => {
      const whiteCard = page.locator(".card").last();
      await expect(whiteCard).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)"
      );
    });

    test("should have correct color at balance", async ({ page }) => {
      const whiteCard = page.locator(".card").last();
      const balance = whiteCard.locator(".balance");
      const textElements = await balance.locator("*").all();
      for (const element of textElements) {
        await expect(element).toHaveCSS("color", "rgb(52, 60, 106)");
      }
    });

    test("should have correct color at card-text", async ({ page }) => {
      const whiteCard = page.locator(".card").last();
      const cardTexts = await whiteCard.locator(".card-text").all();
      for (const cardText of cardTexts) {
        // Реализовал через `opacity` в `.card-unit` -> `.card-key`.
        // const textBlockName = cardText.locator("*").first();
        // await expect(textBlockName).toHaveCSS("color", "rgb(113, 142, 191)");

        const textBlockValue = cardText.locator("*").last();
        await expect(textBlockValue).toHaveCSS("color", "rgb(52, 60, 106)");
      }
    });

    test("should have correct color for card number", async ({ page }) => {
      const whiteCard = page.locator(".card").last();
      const cardNumber = whiteCard.locator(".card-number");

      await expect(cardNumber).toHaveCSS("color", "rgb(52, 60, 106)");
    });

    test("should match screenshot", async ({ page }) => {
      const blueCard = page.locator(".card").last();
      await expect(blueCard).toHaveScreenshot();
    });
  });
});

test.describe("test operations", () => {
  test("must be flex with correct styles", async ({ page }) => {
    const operations = page.locator("#operations");
    await expect(operations).toHaveCSS("display", "flex");
    await expect(operations).toHaveCSS("flex-direction", "column");
    await expect(operations).toHaveCSS("row-gap", "20px");
  });

  test("should have correct background", async ({ page }) => {
    const operations = page.locator("#recent-operations");
    await expect(operations).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)"
    );
  });

  test("must have header", async ({ page }) => {
    const header = page.locator("#operations > h1");
    await expect(header).toHaveText("Недавние операции");
  });

  test("operation must be flex with correct styles", async ({ page }) => {
    const operations = await page.locator(".operation").all();

    await Promise.all(
      operations.map(async (operation) => {
        await expect(operation).toHaveCSS("display", "flex");
        await expect(operation).toHaveCSS("justify-content", "space-between");
      })
    );
  });

  test("operation amount color should be correct", async ({ page }) => {
    const amounts = await page.locator(".operation .amount").all();
    await expect(amounts[0]).toHaveCSS("color", "rgb(65, 212, 168)");
    await expect(amounts[1]).toHaveCSS("color", "rgb(65, 212, 168)");
    await expect(amounts[2]).toHaveCSS("color", "rgb(255, 75, 74)");
  });

  test("operation icons background-color should be correct", async ({
    page,
  }) => {
    const icons = await page.locator(".operation .icon").all();
    await expect(icons[0]).toHaveCSS("background-color", "rgb(220, 250, 248)");
    await expect(icons[1]).toHaveCSS("background-color", "rgb(220, 250, 248)");
    await expect(icons[2]).toHaveCSS("background-color", "rgb(255, 245, 217)");
  });

  test("should match screenshot", async ({ page }) => {
    const operations = page.locator("#recent-operations");
    await expect(operations).toHaveScreenshot();
  });
});

test.describe("test last-activity", () => {
  test("must be visible", async ({ page }) => {
    const lastActivity = page.locator("#last-activity");
    await expect(lastActivity).toBeVisible();
  });

  test("must have header", async ({ page }) => {
    const header = page.locator("#last-activity > h1");
    await expect(header).toHaveText("Недавняя активность");
  });

  test("should have correct background", async ({ page }) => {
    const weeklyActivity = page.locator("#last-activity > #weekly-activity");
    await expect(weeklyActivity).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)"
    );
  });

  test.describe("weekly-activity-diagram", () => {
    test("should have 6 lines", async ({ page }) => {
      const lines = await page
        .locator("#weekly-activity-diagram .line")
        .count();
      expect(lines).toBe(6);
    });

    test("should have 7 bars", async ({ page }) => {
      const bars = await page
        .locator("#weekly-activity-diagram .bar-wrapper")
        .count();
      expect(bars).toBe(7);
    });

    test("should have 7 days", async ({ page }) => {
      const days = await page.locator("#weekly-activity-diagram .day").count();
      expect(days).toBe(7);
    });

    test("should have 7 bar-red and bar-green", async ({ page }) => {
      const barsRed = await page
        .locator("#weekly-activity-diagram .bar-red")
        .count();
      expect(barsRed).toBe(7);

      const barsGreen = await page
        .locator("#weekly-activity-diagram .bar-green")
        .count();
      expect(barsGreen).toBe(7);
    });

    test("should match screenshot", async ({ page }) => {
      const diagram = page.locator("#weekly-activity-diagram");
      await expect(diagram).toHaveScreenshot();
    });
  });
});

test.describe("test costs", () => {
  test("must be visible", async ({ page }) => {
    const costs = page.locator("#costs");
    await expect(costs).toBeVisible();
  });

  test("must have header", async ({ page }) => {
    const header = page.locator("#costs > h1");
    await expect(header).toHaveText("Статистика расходов");
  });

  test("should have correct background", async ({ page }) => {
    const weeklyActivity = page.locator("#costs > #cost-diagram");
    await expect(weeklyActivity).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)"
    );
  });

  test("should have 6 bars", async ({ page }) => {
    const bars = await page.locator("#cost-diagram .bar").count();
    expect(bars).toBe(6);
  });

  test("bars should have correct background", async ({ page }) => {
    const bars = await page.locator("#cost-diagram .bar > div").all();
    await Promise.all(
      bars.map(async (bar, index) => {
        const targetColor =
          index === 4 ? "rgb(22, 219, 204)" : "rgb(237, 240, 247)";
        await expect(bar).toHaveCSS("background-color", targetColor);
      })
    );
  });

  test("should match screenshot", async ({ page }) => {
    const diagram = page.locator("#cost-diagram");
    await expect(diagram).toHaveScreenshot();
  });
});
