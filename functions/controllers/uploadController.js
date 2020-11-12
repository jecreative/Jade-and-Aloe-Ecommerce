const { db, admin } = require('../utils/firebaseAdmin')
const config = require('../utils/firebaseConfig')


// Upload product image
//! MAKE SURE TO SET RULES AFTER CONFIGURING SUCCESSFUL UPLOADS !//
//! BEFORE MOVING FORWARD WITH PRODUCTION !//

//* Attempt 1 - Multiple Image Upload
exports.uploadImageToFirebaseStorage = async (req, res) => {
  const BusBoy = require('busboy')
  const path = require('path')
  const os = require('os')
  const fs = require('fs')

  let fields = {}

  const busboy = new BusBoy({ headers: req.headers })

  let imageFileName = {}
  let imagesToUpload = []
  let imageToAdd = {}
  let imageUrls = []

  busboy.on('field', (fieldname, fieldvalue) => {
    fields[fieldname] = fieldvalue
  })

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted!' })
    }

    //* Getting extension of any image
    const imageExtension = filename.split('.')[filename.split('.').length - 1]

    //* Setting filename
    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`

    //* Creating path
    const filepath = path.join(os.tmpdir(), imageFileName)
    imageToAdd = {
      imageFileName,
      filepath,
      mimetype,
    }

    file.pipe(fs.createWriteStream(filepath))

    //* Add image to the array
    imagesToUpload.push(imageToAdd)
  })

  busboy.on('finish', async () => {
    let promises = []

    imagesToUpload.forEach((imageToBeUploaded) => {
      imageUrls.push(
        `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageToBeUploaded.imageFileName}?alt=media`
      )
      promises.push(
        admin
          .storage()
          .bucket()
          .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageToBeUploaded.mimetype,
              },
            },
          })
      )
    })

    try {
      await Promise.all(promises)
      return res.json({
        message: `${imageUrls}`,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  })

  busboy.end(req.rawBody)
}
