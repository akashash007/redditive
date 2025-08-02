export function getBestThumbnail(item) {
    const FALLBACK_IMAGE = "/redditive_favicon.png";

    const isGallery = item.data.is_gallery;
    const isVideo = item.data.is_video;
    const previewImage = item.data.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&");

    if (isGallery && item.data.gallery_data?.items && item.data.media_metadata) {
        const firstId = item.data.gallery_data.items[0].media_id;
        const galleryImage = item.data.media_metadata[firstId]?.s?.u?.replace(/&amp;/g, "&");
        if (galleryImage) return galleryImage;
    }

    if (isVideo && previewImage) return previewImage;
    if (previewImage) return previewImage;

    const thumb = item.data.thumbnail;
    const isValidThumbnail =
        thumb?.startsWith("http") &&
        !["default", "self", "image", "nsfw", "spoiler"].includes(thumb);

    if (isValidThumbnail && !thumb.includes("external-preview")) return thumb;

    return FALLBACK_IMAGE;
}
