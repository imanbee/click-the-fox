import { ImageService } from "./ImageService";
import fetchMock from "jest-fetch-mock";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

describe("ImageService", () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset mocks before each test
  });

  test("fetchImages returns a shuffled array of 9 images with correct types", async () => {
    // Mock the API responses
    fetchMock.mockResponses(
      [
        JSON.stringify({ image: "http://example.com/fox.jpg" }),
        { status: 200 },
      ], // Mock fox API
      [
        JSON.stringify([
          { url: "http://example.com/cat1.jpg" },
          { url: "http://example.com/cat2.jpg" },
          { url: "http://example.com/cat3.jpg" },
          { url: "http://example.com/cat4.jpg" },
        ]),
        { status: 200 },
      ], // Mock cat API
      [
        JSON.stringify({ message: "http://example.com/dog1.jpg" }),
        { status: 200 },
      ],
      [
        JSON.stringify({ message: "http://example.com/dog2.jpg" }),
        { status: 200 },
      ],
      [
        JSON.stringify({ message: "http://example.com/dog3.jpg" }),
        { status: 200 },
      ],
      [
        JSON.stringify({ message: "http://example.com/dog4.jpg" }),
        { status: 200 },
      ] // Mock dog API responses individually
    );

    const images = await ImageService.fetchImages();

    // Verify the combined array contains 9 images
    expect(images).toHaveLength(9);

    // Verify the array contains all expected image types
    const imageTypes = images.map((img) => img.type);
    expect(imageTypes.filter((type) => type === "fox")).toHaveLength(1);
    expect(imageTypes.filter((type) => type === "cat")).toHaveLength(4);
    expect(imageTypes.filter((type) => type === "dog")).toHaveLength(4);

    // Since the array is shuffled, we can't predict the order of images,
    // but we can verify the URLs are as expected
    const imageUrls = images.map((img) => img.url);
    expect(imageUrls).toContain("http://example.com/fox.jpg");
    expect(imageUrls).toContain("http://example.com/cat1.jpg");
    expect(imageUrls).toContain("http://example.com/dog1.jpg");
    // Add similar checks for the rest of the expected URLs
  });
});
