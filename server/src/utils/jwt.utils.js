import * as jose from "jose";

const getSigningSecret = () => {
  const secretHex = process.env.JWT_SIGNING_SECRET;
  if (!secretHex) {
    throw new Error("JWT_SIGNING_SECRET environment variable is missing.");
  }

  const keyBuffer = Buffer.from(secretHex, "hex");
  if (keyBuffer.byteLength < 32) {
    throw new Error(`JWT_SIGNING_SECRET must be at least 32 bytes.`);
  }

  return keyBuffer;
};

const getEncryptionKey = () => {
  const secretHex = process.env.JWE_SECRET;

  if (!secretHex) {
    throw new Error("JWE_SECRET environment variable is missing.");
  }

  const keyBuffer = Buffer.from(secretHex, "hex");

  if (keyBuffer.byteLength !== 32) {
    throw new Error(`JWE_SECRET must be 32 bytes.`);
  }

  return keyBuffer;
};

const createToken = async (payload) => {
  try {
    const signingKey = getSigningSecret();
    const encryptionKey = getEncryptionKey();

    const signedJwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(signingKey);

    const nestedJwe = await new jose.CompactEncrypt(
      new TextEncoder().encode(signedJwt)
    )
      .setProtectedHeader({
        alg: "dir",
        enc: "A256GCM",
        cty: "JWT",
      })
      .encrypt(encryptionKey);

    return nestedJwe;
  } catch (err) {
    console.error("Nested JWT Creation Error:", err.message);
    throw new Error("Failed to create secure token.");
  }
};

const verifyToken = async (token) => {
  try {
    const signingKey = getSigningSecret();
    const encryptionKey = getEncryptionKey();

    const { plaintext } = await jose.compactDecrypt(token, encryptionKey);

    const signedJwtString = new TextDecoder().decode(plaintext);

    const { payload } = await jose.jwtVerify(signedJwtString, signingKey, {});

    return payload;
  } catch (err) {
    console.error("Nested JWT Verification Error:", err.message);
    throw new Error(
      "Authentication failed: Token is invalid, tampered, or expired."
    );
  }
};

export { createToken, verifyToken };
