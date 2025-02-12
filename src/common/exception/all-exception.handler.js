const AllExceptionHandler = (err, req, res, next) => {
  let status = err?.statusCode ?? err?.status ?? err?.code

  if (!status || isNaN(+status) || status > 511 || status < 200) status = 500

  res.send({
    statusCode: status,
    message: err?.message ?? err?.stack ?? "internalServerError",
  })
}

module.exports = AllExceptionHandler