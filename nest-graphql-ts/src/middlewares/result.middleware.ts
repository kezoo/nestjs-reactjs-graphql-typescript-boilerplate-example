import { Injectable, NestMiddleware } from "@nestjs/common"

@Injectable()
export class ResultMiddleware implements NestMiddleware {
  use (req: any, res: any, next: (error?: any) => void) {
    // console.log(`ResultMiddleware RES `, res.outputData)
    next();
  }
}
