export declare const getClient: (apiKey: string) => Promise<import("@hyperbrowser/sdk").default>;
export declare const logWithTimestamp: ({ level, name, data, }: {
    level?: "info" | "warning" | "error" | undefined;
    name?: string | undefined;
    data?: any;
}) => void;
/**
 * Downloads an image from a URL and converts it to base64
 * @param imageUrl The URL of the image to download
 * @returns Promise resolving to the base64-encoded image data
 */
export declare const downloadImageAsBase64: (imageUrl: string) => Promise<{
    data: string;
    mimeType: string;
} | null>;
//# sourceMappingURL=utils.d.ts.map