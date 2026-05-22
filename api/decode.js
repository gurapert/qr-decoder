const Jimp = require('jimp');
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
    const img = await Jimp.read(buffer);
    
    const imageData = {
      data: new Uint8ClampedArray(img.bitmap.data),
      width: img.bitmap.width,
      height: img.bitmap.height
    };

    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (code) {
      return res.status(200).json({ qr: code.data });
    } else {
      return res.status(200).json({ qr: '' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
