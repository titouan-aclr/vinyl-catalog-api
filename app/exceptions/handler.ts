import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import {
  DuplicateSkuError,
  InsufficientStockError,
  VariantNotFoundError,
} from '#exceptions/variant_errors'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof VariantNotFoundError) {
      return ctx.response.notFound({ message: error.message })
    }

    if (error instanceof DuplicateSkuError) {
      return ctx.response.conflict({ message: error.message })
    }

    if (error instanceof InsufficientStockError) {
      return ctx.response.unprocessableEntity({ message: error.message })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
