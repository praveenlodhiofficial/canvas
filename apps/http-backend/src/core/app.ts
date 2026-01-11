import { withCors } from "@/middleware/cors.middleware";
import { Router } from "@/core/router";

type Middleware = (req: Request) => Promise<Response | null>;

export class App {
  private router;
  private middlewares: Middleware[] = [];

  constructor(router: Router) {
    this.router = router;
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  async fetch(req: Request): Promise<Response> {
    for (const mw of this.middlewares) {
      const result = await mw(req);
      if (result) return result; // middleware blocked request
    }

    const response = await this.router.handle(req);
    return withCors(response);
    return response;
  }
}
