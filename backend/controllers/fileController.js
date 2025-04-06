exports.uploadFile = (req, res) => {
    res.json({ file: req.file.filename });
  };