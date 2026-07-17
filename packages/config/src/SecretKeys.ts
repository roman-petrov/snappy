const keys = {
  adminPassword: `ADMIN_PASSWORD`,
  adminUsername: `ADMIN_USERNAME`,
  aiTunnelApiKey: `AI_TUNNEL_API_KEY`,
  androidCertSha256: `ANDROID_CERT_SHA256`,
  androidKeystoreBase64: `ANDROID_KEYSTORE_BASE64`,
  androidKeystorePassword: `ANDROID_KEYSTORE_PASSWORD`,
  dbHost: `DB_HOST`,
  dbName: `DB_NAME`,
  dbPassword: `DB_PASSWORD`,
  dbPort: `DB_PORT`,
  dbUser: `DB_USER`,
  jwtSecret: `JWT_SECRET`,
  robokassaMerchantLogin: `ROBOKASSA_MERCHANT_LOGIN`,
  robokassaPassword1: `ROBOKASSA_PASSWORD1`,
  robokassaPassword2: `ROBOKASSA_PASSWORD2`,
  s3AccessKey: `S3_ACCESS_KEY`,
  s3Bucket: `S3_BUCKET`,
  s3SecretKey: `S3_SECRET_KEY`,
  smtpPassword: `SMTP_PASSWORD`,
  smtpUser: `SMTP_USER`,
  sslCertKey: `SSL_CERT_KEY`,
  sslCertPem: `SSL_CERT_PEM`,
  tunnelKey: `TUNNEL_KEY`,
} as const;

export type SecretKey = (typeof keys)[keyof typeof keys];

export type SecretValues = Partial<Record<SecretKey, string>>;

export const SecretKeys = keys;
