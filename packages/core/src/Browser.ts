// cspell:word iemobile
const mobileRe = /android|blackberry|iemobile|ipad|iphone|ipod|mobile|opera mini|webos/iu;
const mobile = (userAgent: string) => mobileRe.test(userAgent);

export const Browser = { mobile };
