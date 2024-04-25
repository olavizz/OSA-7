import { test, expect, describe, beforeEach } from "@playwright/test";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const locator = await page.getByText("Log in to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("salainen");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("julkinen");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page, request }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("salainen");

      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("a test blog");
      await page.getByTestId("author").fill("test author");
      await page.getByTestId("url").fill("www.testblog");
      await page.getByRole("button", { name: "create" }).click();
      await expect(page.getByText("a new blog a test blog by test author"))
        .toBeVisible;
      await expect(page.getByText("a test blog test author")).toBeVisible;
    });
    test("a blog can be liked", async ({ page, request }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("a test blog");
      await page.getByTestId("author").fill("test author");
      await page.getByTestId("url").fill("www.testblog");
      await page.getByRole("button", { name: "create" }).click();
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByText("0")).toBeVisible;
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("1")).toBeVisible;
    });
    test("a blog can be deleted", async ({ page, request }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("a test blog");
      await page.getByTestId("author").fill("test author");
      await page.getByTestId("url").fill("www.testblog");
      await page.getByRole("button", { name: "create" }).click();
      await expect(page.getByText("a new blog a test blog by test author"))
        .toBeVisible;
      await expect(page.getByText("a test blog test author")).toBeVisible;
      await page.getByRole("button", { name: "view" }).click();

      await page.on("dialog", async (dialog) => {
        console.log(dialog.message());
        await dialog.accept();
      });
      await page.getByRole("button", { name: "remove" }).click();

      await page.waitForTimeout(1000);

      const emptyBlogs = await request.get("http://localhost:3003/api/blogs");
      console.log(emptyBlogs.json());
      await expect(emptyBlogs.json()).resolves.toEqual([]);
    });
  });
});
