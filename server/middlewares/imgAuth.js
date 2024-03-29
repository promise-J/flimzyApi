const fs = require("fs");

const uploadImage = async (req, res, next) => {
  try {
    // if(!req.files || Object.keys(req.files).length === 0)
    if (!req.files) {
      return res.status(400).json({ msg: "No file was uploaded" });
    }
    const file = req.files.file;
    // console.log(file.mimetype)
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Size too large" });
    }
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Invalid file format" });
    }
    next();
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = uploadImage;

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      throw err;
    }
    console.log(path + " has been deleted.");
  });
};
