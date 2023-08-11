// const sharp = require('sharp');
// const fs = require('fs');

// const convertToWebp = async (req, res, next) => {
//   if (!req.file) return next();

//   console.log("sharp - req.file:", req.file)

//   const inputFile = req.file.path;
//   const outputFile = inputFile.replace(/\.(jpg|jpeg|png)$/, '.webp');

//   try {
//     await sharp(inputFile).toFormat('webp').toFile(outputFile);
//     fs.unlinkSync(inputFile);

//     req.file.path = outputFile;
//     req.file.mimetype = 'image/webp';
//     req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');
//   } catch (err) {
//     console.error("Error while converting image:", err);
//   }
//   next();
// };

// module.exports = convertToWebp;

const sharp = require("sharp")
const path = require('path')

module.exports = (req, res, next) => {

  console.log("req.file:", req.file)
  if (!req.file) {
    next()
    return
  }

  const { buffer, fieldname } = req.file;
  const filename = `${fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
  sharp(buffer)
    .webp()
    .toFile(path.resolve(__dirname, `../images/${filename}`), (err, info) => {
      console.log(err || info)
      if (err) {
        return res.status(400).json({ error: err })
      }
      req.file.filename = filename
      next()
    })
}