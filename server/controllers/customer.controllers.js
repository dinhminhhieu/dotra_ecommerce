const { errorMessage, successMessage } = require("../config/message.config");
const { createVerifyToken, createToken } = require("../utils/jwt");
const customerModel = require("../database/models/customer.models");
const sellerToCustomerModel = require("../database/models/sellerToCustomer.models");
const formidable = require("formidable");
const env = require("../config/env.config");
const cloudinary = require("cloudinary").v2;
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const oauthGoogle = require("../utils/oauthGoogle");

class customerController {
  // 1. Customer đăng ký tài khoản
  customer_register = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, field, files) => {
      let { name, email, password } = field;
      let { avatar } = files;

      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        secure: true,
      });

      try {
        const isEmailExist = await customerModel.findOne({ email });
        if (isEmailExist) {
          response(res, httpStatusCode.BadRequest, {
            message: errorMessage.EMAIL_ALREADY_EXIST,
          });
        } else {
          const upload = await cloudinary.uploader.upload(avatar.filepath, {
            folder: "dotra_customer",
          });

          if (upload) {
            const customer = {
              name: name.trim(),
              email: email.trim(),
              password: password.trim(),
              avatar: upload.url,
            };

            const email_token = await createVerifyToken(customer);
            await sendMail({
              email: customer.email,
              html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
  <head>
    <!-- Compiled with Bootstrap Email version: 1.3.1 -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
    <style type="text/css">
      body,
      table,
      td {
        font-family: Helvetica, Arial, sans-serif !important;
      }
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 150%;
      }
      a {
        text-decoration: none;
      }
      * {
        color: inherit;
      }
      a[x-apple-data-detectors],
      u + #body a,
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
      img {
        -ms-interpolation-mode: bicubic;
      }
      table:not([class^='s-']) {
        font-family: Helvetica, Arial, sans-serif;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        border-spacing: 0px;
        border-collapse: collapse;
      }
      table:not([class^='s-']) td {
        border-spacing: 0px;
        border-collapse: collapse;
      }
      @media screen and (max-width: 600px) {
        .w-full,
        .w-full > tbody > tr > td {
          width: 100% !important;
        }
        .w-24,
        .w-24 > tbody > tr > td {
          width: 96px !important;
        }
        .w-40,
        .w-40 > tbody > tr > td {
          width: 160px !important;
        }
        .p-lg-10:not(table),
        .p-lg-10:not(.btn) > tbody > tr > td,
        .p-lg-10.btn td a {
          padding: 0 !important;
        }
        .p-3:not(table),
        .p-3:not(.btn) > tbody > tr > td,
        .p-3.btn td a {
          padding: 12px !important;
        }
        .p-6:not(table),
        .p-6:not(.btn) > tbody > tr > td,
        .p-6.btn td a {
          padding: 24px !important;
        }
        *[class*='s-lg-'] > tbody > tr > td {
          font-size: 0 !important;
          line-height: 0 !important;
          height: 0 !important;
        }
        .s-4 > tbody > tr > td {
          font-size: 16px !important;
          line-height: 16px !important;
          height: 16px !important;
        }
        .s-6 > tbody > tr > td {
          font-size: 24px !important;
          line-height: 24px !important;
          height: 24px !important;
        }
        .s-10 > tbody > tr > td {
          font-size: 40px !important;
          line-height: 40px !important;
          height: 40px !important;
        }
      }
    </style>
  </head>
  <body
    class="bg-light"
    style="
      outline: 0;
      width: 100%;
      min-width: 100%;
      height: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-family: Helvetica, Arial, sans-serif;
      line-height: 24px;
      font-weight: normal;
      font-size: 16px;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #000000;
      margin: 0;
      padding: 0;
      border-width: 0;
    "
    bgcolor="#f7fafc"
  >
    <table
      class="bg-light body"
      valign="top"
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      style="
        outline: 0;
        width: 100%;
        min-width: 100%;
        height: 100%;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        font-family: Helvetica, Arial, sans-serif;
        line-height: 24px;
        font-weight: normal;
        font-size: 16px;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #000000;
        margin: 0;
        padding: 0;
        border-width: 0;
      "
      bgcolor="#f7fafc"
    >
      <tbody>
        <tr>
          <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0" align="left" bgcolor="#f7fafc">
            <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px">
                    <!--[if (gte mso 9)|(IE)]>
                      <table align="center" role="presentation">
                        <tbody>
                          <tr>
                            <td width="600">
                    <![endif]-->
                    <table
                      align="center"
                      role="presentation"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="width: 100%; max-width: 600px; margin: 0 auto"
                    >
                      <tbody>
                        <tr>
                          <td style="line-height: 24px; font-size: 16px; margin: 0" align="left">
                            <table
                              class="s-10 w-full"
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%"
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                    align="left"
                                    width="100%"
                                    height="40"
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class="ax-center"
                              role="presentation"
                              align="center"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="margin: 0 auto"
                            >
                              <tbody>
                                <tr>
                                  <td style="line-height: 24px; font-size: 16px; margin: 0" align="left">
                                    <img
                                      class="w-24"
                                      src="https://res.cloudinary.com/damiapdnh/image/upload/v1714124119/logo/logo_di1oyf.png"
                                      style="
                                        height: 50px;
                                        line-height: 100%;
                                        outline: none;
                                        text-decoration: none;
                                        display: block;
                                        width: 220px;
                                        border-style: none;
                                        border-width: 0;
                                      "
                                      width="96"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class="s-10 w-full"
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%"
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                    align="left"
                                    width="100%"
                                    height="40"
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class="card p-6 p-lg-10 space-y-4"
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="
                                border-radius: 6px;
                                border-collapse: separate !important;
                                width: 100%;
                                overflow: hidden;
                                border: 1px solid #e2e8f0;
                              "
                              bgcolor="#ffffff"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px"
                                    align="left"
                                    bgcolor="#ffffff"
                                  >
                                    <h1
                                      class="h3 fw-700"
                                      style="
                                        padding-top: 0;
                                        padding-bottom: 0;
                                        font-weight: 700 !important;
                                        vertical-align: baseline;
                                        font-size: 28px;
                                        line-height: 33.6px;
                                        margin: 0;
                                      "
                                      align="left"
                                    >
                                      XÁC THỰC TÀI KHOẢN
                                    </h1>
                                    <table
                                      class="s-4 w-full"
                                      role="presentation"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      style="width: 100%"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              line-height: 16px;
                                              font-size: 16px;
                                              width: 100%;
                                              height: 16px;
                                              margin: 0;
                                            "
                                            align="left"
                                            width="100%"
                                            height="16"
                                          >
                                            &#160;
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <p
                                      class=""
                                      style="line-height: 24px; font-size: 16px; width: 100%; margin: 0"
                                      align="left"
                                    >
                                      Xin chào ${customer.name}, Chào mừng bạn đến với Dotra Ecommerce, vui lòng nhấn vào nút bên dưới để xác thực tài khoản
                                    </p>
                                    <table
                                      class="s-4 w-full"
                                      role="presentation"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      style="width: 100%"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              line-height: 16px;
                                              font-size: 16px;
                                              width: 100%;
                                              height: 16px;
                                              margin: 0;
                                            "
                                            align="left"
                                            width="100%"
                                            height="16"
                                          >
                                            &#160;
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      class="btn btn-primary p-3 fw-700"
                                      role="presentation"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      style="
                                        border-radius: 6px;
                                        border-collapse: separate !important;
                                        font-weight: 700 !important;
                                      "
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              line-height: 24px;
                                              font-size: 16px;
                                              border-radius: 6px;
                                              font-weight: 700 !important;
                                              margin: 0;
                                            "
                                            align="center"
                                            bgcolor="#0d6efd"
                                          >
                                            <a
                                              href="http://localhost:3001/verify-email-customer/${email_token}"
                                              style="
                                                color: #ffffff;
                                                font-size: 16px;
                                                font-family: Helvetica, Arial, sans-serif;
                                                text-decoration: none;
                                                border-radius: 6px;
                                                line-height: 20px;
                                                display: block;
                                                font-weight: 700 !important;
                                                white-space: nowrap;
                                                background-color: #0d6efd;
                                                padding: 12px;
                                                border: 1px solid #0d6efd;
                                              "
                                              >Xác thực tài khoản</a
                                            >
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class="s-10 w-full"
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%"
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                    align="left"
                                    width="100%"
                                    height="40"
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class="s-6 w-full"
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%"
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0"
                                    align="left"
                                    width="100%"
                                    height="24"
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class="s-6 w-full"
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%"
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0"
                                    align="left"
                                    width="100%"
                                    height="24"
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                  </tr>
                </tbody>
              </table>
                    <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
            });
            response(res, httpStatusCode.Ok, {
              message: successMessage.VERIFY_EMAIL,
            });
          } else {
            response(res, httpStatusCode.BadRequest, {
              message: errorMessage.UPLOAD_IMAGE_FAIL,
            });
          }
        }
      } catch (error) {
        response(res, httpStatusCode.InternalServerError, {
          message: error.message,
        });
      }
    });
  };

  // 2. Customer xác thực email và lưu thông tin customer vào database
  verify_email = async (req, res) => {
    const { email_token } = req.params;
    try {
      const customer = jwt.verify(email_token, env.VERIFY_EMAIL_SECRET_KEY);
      if (customer) {
        const { name, email, password, avatar } = customer;
        const salt = await bcrypt.genSalt(10);
        const new_customer = await customerModel.create({
          name: name,
          email: email,
          password: await bcrypt.hash(password, salt),
          isVerified: true,
          avatar: avatar,
          customerInfo: {},
        });

        await sellerToCustomerModel.create({
          myId: new_customer.id,
          myFriends: [],
        });
        response(res, httpStatusCode.Created, {
          message: successMessage.REGISTER_SUCCESS,
        });
      }
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 3. Customer đăng nhập
  customer_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const customer = await customerModel.findOne({ email });
      if (customer && customer.isVerified) {
        const isMatch = await bcrypt.compare(password, customer.password);
        if (isMatch) {
          const customer_access_token = await createToken({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            avatar: customer.avatar,
          });
          res.cookie("customer_access_token", customer_access_token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          response(res, httpStatusCode.Ok, {
            message: successMessage.LOGIN_SUCCESS,
            data: customer_access_token,
          });
        } else {
          response(res, httpStatusCode.BadRequest, {
            message: errorMessage.PASSWORD_NOT_MATCH,
          });
        }
      }
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 4. Đăng nhập bằng google
  oauth_google = async (req, res) => {
    const { code } = req.query;
    const userInfo = await oauthGoogle.loginWithGoogle(code);
    const { email, verified_email, given_name, family_name, picture } =
      userInfo;
    try {
      if (verified_email) {
        const isEmailExist = await customerModel.findOne({ email });
        if (isEmailExist) {
          const customer_access_token = await createToken({
            id: isEmailExist.id,
            name: isEmailExist.name,
            email: isEmailExist.email,
            avatar: isEmailExist.avatar,
          });
          res.cookie("customer_access_token", customer_access_token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          const urlRedirect = `${env.CLIENT_REDIRECT_CALLBACK}?customer_access_token=${customer_access_token}`;
          return res.redirect(urlRedirect);
        } else {
          const new_customer = await customerModel.create({
            name: `${family_name} ${given_name}`,
            email: email,
            password: Math.random().toString(36).substring(2, 15),
            isVerified: true,
            avatar: picture,
            customerInfo: {},
          });
          await sellerToCustomerModel.create({
            myId: new_customer.id,
            myFriends: [],
          });
          const customer_access_token = await createToken({
            id: new_customer.id,
            name: new_customer.name,
            email: new_customer.email,
            avatar: new_customer.avatar,
          });
          res.cookie("customer_access_token", customer_access_token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          const urlRedirect = `${env.CLIENT_REDIRECT_CALLBACK}?customer_access_token=${customer_access_token}`;
          return res.redirect(urlRedirect);
        }
      } else {
        response(res, httpStatusCode.BadRequest, {
          message: errorMessage.EMAIL_NOT_FOUND,
        });
      }
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 5. Customer đăng xuất
  customer_logout = async (req, res) => {
    res.clearCookie("customer_access_token");
    response(res, httpStatusCode.Ok, {
      message: successMessage.LOGOUT_SUCCESS,
    });
  };
}

module.exports = new customerController();
