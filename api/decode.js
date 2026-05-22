const sharp = require('sharp');
const jsQR = require('jsqr');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const buffer = Buffer.from(image, 'base64');
    
    const { data, info } = await sharp(buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const code = jsQR(
      new Uint8ClampedArray(data),
      info.width,
      info.height
    );

    return res.status(200).json({ qr: code ? code.data : '' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
