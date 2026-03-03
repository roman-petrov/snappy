// cspell:word iemobile
const mobileRe = /android|blackberry|iemobile|ipad|iphone|ipod|mobile|opera mini|webos/iu;
const mobile = (userAgent: string): boolean => mobileRe.test(userAgent);

export const Browser = { mobile };
