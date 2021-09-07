// @flow

/**
 * An enumeration of the different virtual background types.
 *
 * @enum {string}
 */
export const VIRTUAL_BACKGROUND_TYPE = {
    IMAGE: 'image',
    DESKTOP_SHARE: 'desktop-share',
    BLUR: 'blur',
    NONE: 'none',
    DESKTOP_SHARE_TRANSFORM: 'desktop-share-transform',
    TRANSPARENT_PREVIEW: 'transparent-preview'
};

/**
 * An enumeration of the different desktop share dimensions types.
 *
 * @enum {string}
 */
export const DESKTOP_SHARE_DIMENSIONS = {
    RECTANGLE_WIDTH: 200,
    RECTANGLE_HEIGHT: 100,
    CONTAINER_WIDTH: 600,
    CONTAINER_HEIGHT: 250
};


export type Image = {
    tooltip?: string,
    id: string,
    src: string
}

// The limit of virtual background uploads is 24. When the number
// of uploads is 25 we trigger the deleteStoredImage function to delete
// the first/oldest uploaded background.
export const BACKGROUNDS_LIMIT = 25;


export const IMAGES: Array<Image> = [
    {
        tooltip: 'image1',
        id: '1',
        src: 'images/virtual-background/background-1.jpg'
    },
    {
        tooltip: 'image2',
        id: '2',
        src: 'images/virtual-background/background-2.jpg'
    },
    {
        tooltip: 'image3',
        id: '3',
        src: 'images/virtual-background/background-3.jpg'
    },
    {
        tooltip: 'image4',
        id: '4',
        src: 'images/virtual-background/background-4.jpg'
    },
    {
        tooltip: 'image5',
        id: '5',
        src: 'images/virtual-background/background-5.jpg'
    },
    {
        tooltip: 'image6',
        id: '6',
        src: 'images/virtual-background/background-6.jpg'
    },
    {
        tooltip: 'image7',
        id: '7',
        src: 'images/virtual-background/background-7.jpg'
    }
];
