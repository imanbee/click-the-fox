// src/ImageService.ts

class ImageService {
  private static imageQueue: { url: string; type: string }[][] = [];

  // Public method to preload images
  public static async preloadImages(): Promise<void> {
    while (this.imageQueue.length < 5) {
      const allImages = await this.fetchImages();
      this.imageQueue.push(allImages);
    }
  }

  // Method to fetch set of images
  public static async fetchImages(): Promise<{ url: string; type: string }[]> {
    const foxImage = await this.fetchFoxImage();
    const catImages = await this.fetchCatImages();
    const dogImages = await this.fetchDogImages();
    let allImages = [foxImage, ...catImages, ...dogImages];
    allImages = this.shuffleImages(allImages);
    return allImages;
  }

  // Fetches a single fox image
  private static async fetchFoxImage(): Promise<{ url: string; type: string }> {
    const response = await fetch("https://randomfox.ca/floof/");
    const data = await response.json();
    return { url: data.image, type: "fox" }; // Assuming the API returns an object with an 'image' field
  }

  // Fetches 4 cat images
  private static async fetchCatImages(): Promise<
    { url: string; type: string }[]
  > {
    const limit = 4; // Fetching 4 to have a total of 9 with dogs and a fox
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${limit}`
    );
    const data = await response.json();
    return data
      .slice(0, limit)
      .map((item: any) => ({ url: item.url, type: "cat" })); // Assuming each item in the array has a 'url' field
  }

  // Fetches 4 dog images
  private static async fetchDogImages(): Promise<
    { url: string; type: string }[]
  > {
    const result: { url: string; type: string }[] = [];
    for (let i = 0; i < 4; i++) {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();
      result.push({ url: data.message, type: "dog" }); // Assuming the API returns an object with a 'message' field for the image URL
    }
    return result;
  }

  // Method to shuffle the images array
  private static shuffleImages(
    images: { url: string; type: string }[]
  ): { url: string; type: string }[] {
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]]; // Swap
    }
    return images;
  }

  // Method to get the next set of images from the queue
  public static async getNextImageSet(): Promise<
    { url: string; type: string }[]
  > {
    if (this.imageQueue.length === 0) {
      console.warn("No preloaded image sets available. Preloading...");
      await this.preloadImages();
    }
    const nextSet = this.imageQueue.shift()!;
    this.preloadImages(); // Ensure the queue is replenished after taking a set

    return nextSet;
  }
}

export { ImageService };
