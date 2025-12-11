type Handler = (
  req: Request,
  params: Record<string, string>,
) => Promise<Response> | Response;

export class Router {
  private routes: Record<string, Record<string, Handler>> = {};

  register(method: string, path: string, handler: Handler) {
    method = method.toUpperCase();

    let routeGroup = this.routes[method];
    if (!routeGroup) {
      routeGroup = {};
      this.routes[method] = routeGroup;
    }

    routeGroup[path] = handler;
  }

  get(path: string, handler: Handler) {
    this.register("GET", path, handler);
  }

  post(path: string, handler: Handler) {
    this.register("POST", path, handler);
  }

  put(path: string, handler: Handler) {
    this.register("PUT", path, handler);
  }

  delete(path: string, handler: Handler) {
    this.register("DELETE", path, handler);
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method.toUpperCase();

    const match = this.routes[method]?.[pathname];
    if (!match) return new Response("Not Found", { status: 404 });

    return match(req, {});
  }
}
