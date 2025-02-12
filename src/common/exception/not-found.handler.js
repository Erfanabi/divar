const notFoundError = (req, res, next) => {
  res.send({
    statusCode: 404, message: 'not found ' + req.url + " route",
  })
}

module.exports = notFoundError