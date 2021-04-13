import Joi from "joi"
import jwt from "jsonwebtoken"
import { secretKey } from "../configs"
import { CODE } from "../constants"
import { schema } from "../validations/schema"

export const isVerifiedToken = async (req, res, next) => {
  if (req.get("Authorization") === undefined) {
    res.json({
      code: CODE.INVALID_TOKEN,
      message: "Thiếu dữ liệu Authorization và Access Token"
    })
    return
  }
  const accessToken = req.get("Authorization")
  if (accessToken) {
    jwt.verify(accessToken, secretKey, async (err, decoded) => {
      if (err) {
        res.json({
          code: CODE.INVALID_TOKEN,
          message: "Không thể xác thực token",
          error: err
        })
      } else {
        next()
      }
    })

  } else {
    res.json({
      code: CODE.INVALID_TOKEN,
      message: "Access token không được để rỗng!"
    })
  }
}

const fieldValidation = (input, template) => {
  for (let item of template) {
    if (!Object.prototype.hasOwnProperty.call(input, item)) {
      return item
    }
  }
  return null
}

// check data field when request
export const requiredField = async (req, response, body, params, query, next) => {
  const bodyChecked = fieldValidation(req.body, body)
  const queryChecked = fieldValidation(req.query, query)
  const paramChecked = fieldValidation(req.params, params)

  const jsonResponse = {}

  if (bodyChecked) {
    jsonResponse.status = CODE.MISSING_BODY
    jsonResponse.message = `Missing! You are missing body field: [${bodyChecked}]`
    response.jsonResponse = jsonResponse
    response.status(jsonResponse.status).json(jsonResponse)
  }

  if (queryChecked) {
    jsonResponse.status = CODE.MISSING_QUERY
    jsonResponse.message = `Missing! You are missing query field: [${bodyChecked}]`
    response.jsonResponse = jsonResponse
    response.status(jsonResponse.status).json(jsonResponse)
  }

  if (paramChecked) {
    jsonResponse.status = CODE.MISSING_BODY
    jsonResponse.message = `Missing! You are missing param field: [${bodyChecked}]`
    response.jsonResponse = jsonResponse
    response.status(jsonResponse.status).json(jsonResponse)
  }

  next()
}

export const validateField = async (req, response, next) => {
  const bodyChecked = Joi.validate(req.body, schema)
  const queryChecked = Joi.validate(req.query, schema)
  const paramChecked = Joi.validate(req.params, schema)

  const jsonResponse = {}

  if (bodyChecked.error) {
    jsonResponse.status = CODE.MISSING_BODY
    jsonResponse.message = `Lỗi định dạng dữ liệu - ${bodyChecked.error.details}`
    response.jsonResponse = jsonResponse
    response.status(jsonResponse.status).json(jsonResponse)
  }

  if (queryChecked.error) {
    jsonResponse.status = CODE.INVALID_QUERY
    jsonResponse.message = `Lỗi định dạng dữ liệu - ${queryChecked.error.details}`
    response.jsonResponse = jsonResponse
    response.status(jsonResponse.status).json(jsonResponse)
  }

  if (paramChecked.error) {
    jsonResponse.status = CODE.INVALID_PARAMS
    jsonResponse.message = `Lỗi định dạng dữ liệu - ${paramChecked.error.details}`
    response.jsonResponse = jsonResponse
    response.status(jsonResponse.status).json(jsonResponse)
  }

  next()
}


