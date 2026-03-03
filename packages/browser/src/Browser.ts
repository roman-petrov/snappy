// cspell:word iemobile
const mobileRe = /android|blackberry|iemobile|ipad|iphone|ipod|mobile|opera mini|webos/iu;

export const isMobile = (userAgent: string): boolean => mobileRe.test(userAgent);

export const mobile = typeof navigator === `undefined` ? false : isMobile(navigator.userAgent);

export const Browser = { isMobile, mobile };
